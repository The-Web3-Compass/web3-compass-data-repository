# Building the React Frontend

The frontend has two main jobs:
1. Encrypt messages client-side before sending to the contract
2. Make blockchain state feel reactive and real-time

## Client-Side Encryption

When a user writes a message, you need to encrypt it before storing it on-chain.

**Why client-side?** If you send plaintext in a transaction, it's visible to everyone. Miners see it. Block explorers see it. It's public before it's encrypted.

Encryption must happen in the user's browser before the transaction is created.

### Using blocklock-js

```javascript
import { Blocklock, encodeCiphertextToSolidity } from "blocklock-js";
import { ethers } from "ethers";

// Encode the message
const encoded = ethers.AbiCoder.defaultAbiCoder().encode(["string"], [messageText]);

// Create blocklock instance
const provider = new ethers.JsonRpcProvider(RPC_URL);
const blocklock = Blocklock.createFromChainId(provider, chainId);

// Encrypt targeting specific block
const encrypted = blocklock.encrypt(
  ethers.getBytes(encoded),
  BigInt(revealBlock)
);

// Format for Solidity
const solidityCiphertext = encodeCiphertextToSolidity(encrypted);

const formattedCiphertext = {
  u: {
    x: [BigInt(solidityCiphertext.u.x[0]), BigInt(solidityCiphertext.u.x[1])],
    y: [BigInt(solidityCiphertext.u.y[0]), BigInt(solidityCiphertext.u.y[1])],
  },
  v: solidityCiphertext.v,
  w: solidityCiphertext.w,
};
```

The ciphertext is now ready to pass to the contract.

---

## Custom Hook for Contract Interaction

Create a hook that encapsulates all blockchain logic:

```typescript
export function useGiftMessages() {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: currentBlock } = useBlockNumber({ watch: true });
  const chainId = useChainId();

  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const [decryptingMessageId, setDecryptingMessageId] = useState<bigint | null>(null);

  // Read user's message IDs
  const { data: userMessageIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: GIFT_MESSAGE_ABI,
    functionName: 'getUserMessages',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Fetch full message data
  useEffect(() => {
    async function fetchMessages() {
      if (!userMessageIds || userMessageIds.length === 0) {
        setUserMessages([]);
        return;
      }

      const messages: Message[] = [];

      for (const id of userMessageIds) {
        const response = await fetch(RPC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_call',
            params: [{
              to: CONTRACT_ADDRESS,
              data: encodeFunctionData({
                abi: GIFT_MESSAGE_ABI,
                functionName: 'getMessage',
                args: [id],
              }),
            }, 'latest'],
            id: 1,
          }),
        });

        const result = await response.json();
        const decoded = decodeFunctionResult({
          abi: GIFT_MESSAGE_ABI,
          functionName: 'getMessage',
          data: result.result,
        });

        messages.push(decoded);
      }

      setUserMessages(messages);
    }

    fetchMessages();
  }, [userMessageIds]);

  // Create message function
  const createMessage = useCallback(async (
    recipient: string,
    messageText: string,
    revealBlock: number
  ) => {
    // Encrypt (as shown above)
    const encrypted = blocklock.encrypt(...);

    // Call contract
    writeCreateMessage({
      address: CONTRACT_ADDRESS,
      abi: GIFT_MESSAGE_ABI,
      functionName: 'createMessage',
      args: [recipient, formattedCiphertext, BigInt(revealBlock)],
    });
  }, [writeCreateMessage]);

  // Request decryption function
  const requestDecryption = useCallback((messageId: bigint, ciphertext: Ciphertext) => {
    setDecryptingMessageId(messageId);
    writeRequestDecrypt({
      address: CONTRACT_ADDRESS,
      abi: GIFT_MESSAGE_ABI,
      functionName: 'requestDecryption',
      args: [messageId, DEFAULT_CALLBACK_GAS_LIMIT, ciphertext],
      value: parseEther(DEFAULT_DECRYPTION_PAYMENT),
    });
  }, [writeRequestDecrypt]);

  // Watch for message revealed events
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: GIFT_MESSAGE_ABI,
    eventName: 'MessageRevealed',
    onLogs(logs) {
      setRefreshTrigger(prev => prev + 1);
      setDecryptingMessageId(null);
    },
  });

  return { createMessage, requestDecryption, userMessages, currentBlock, decryptingMessageId };
}
```

---

## Component Architecture

### CreateMessage Component

```typescript
export function CreateMessage() {
  const { createMessage, currentBlock } = useGiftMessages();
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [revealDateTime, setRevealDateTime] = useState('');

  const revealBlock = revealDateTime && currentBlock
    ? dateToBlock(new Date(revealDateTime), Number(currentBlock))
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createMessage(recipient, message, revealBlock);
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea 
        value={message} 
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your secret message..."
      />
      <input 
        type="text" 
        value={recipient} 
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Recipient address"
      />
      <input 
        type="datetime-local" 
        value={revealDateTime} 
        onChange={(e) => setRevealDateTime(e.target.value)}
      />
      <button type="submit">Send Time-Locked Message</button>
    </form>
  );
}
```

### MessageCard Component

```typescript
function MessageCard({ message, currentBlock, onDecrypt }: MessageCardProps) {
  const blocksRemaining = Number(message.revealBlock) - currentBlock;
  const canDecrypt = blocksRemaining <= 0 && !message.revealed;

  return (
    <div className={message.revealed ? 'revealed' : 'encrypted'}>
      <p>From: {truncateAddress(message.sender)}</p>
      <p>To: {truncateAddress(message.recipient)}</p>
      <p>Reveal Block: {message.revealBlock}</p>

      {!message.revealed && (
        <p>⏳ {formatBlocksRemaining(blocksRemaining)}</p>
      )}

      {canDecrypt && (
        <button onClick={() => onDecrypt(message.id, message.encryptedMessage)}>
          Request Decryption
        </button>
      )}

      {message.revealed && (
        <div className="decrypted-message">
          <p>🎁 {message.decryptedMessage}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Block Time Conversions

Users think in dates. Blockchains think in block numbers.

```typescript
function dateToBlock(targetDate: Date, currentBlock: number): number {
  const now = new Date();
  const secondsUntilTarget = (targetDate.getTime() - now.getTime()) / 1000;

  if (secondsUntilTarget <= 0) {
    return currentBlock + 1;
  }

  const AVERAGE_BLOCK_TIME = 2; // Base Sepolia
  const blocksUntilTarget = Math.floor(secondsUntilTarget / AVERAGE_BLOCK_TIME);
  return currentBlock + blocksUntilTarget;
}

function formatBlocksRemaining(blocksRemaining: number): string {
  if (blocksRemaining <= 0) {
    return 'Ready to decrypt!';
  }

  const secondsRemaining = blocksRemaining * 2;

  if (secondsRemaining < 60) {
    return `${blocksRemaining} blocks (~${secondsRemaining} sec)`;
  }

  const minutes = Math.floor(secondsRemaining / 60);
  if (minutes < 60) {
    return `${blocksRemaining} blocks (~${minutes} min)`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${blocksRemaining} blocks (~${hours}h${remainingMinutes}m)`;
}
```

---

## Key Points

- **Encryption happens client-side** using `blocklock-js`
- **Custom hook** abstracts all blockchain complexity
- **Event watching** makes UI updates automatic
- **Block time conversions** bridge human time and blockchain time
- **Components** are small and focused on single responsibilities

The frontend makes cryptographic time-locks feel simple and intuitive.
