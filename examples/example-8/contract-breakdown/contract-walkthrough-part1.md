
## Breaking Down the Contract

Look at the contract. Inheritance, structs, mappings, events. Around 150 lines total.

Every line serves one goal: **track encrypted media stored elsewhere and orchestrate decryption when conditions are met**.

The contract itself doesn't encrypt anything. Doesn't store media bytes. Doesn't even touch IPFS. It's a coordinator. A registry. A callback handler.

Let's walk through each piece and see what problem it solves.

### Inheritance and Imports

```solidity
import {AbstractBlocklockReceiver} from "blocklock-solidity/src/AbstractBlocklockReceiver.sol";
import {TypesLib} from "blocklock-solidity/src/libraries/TypesLib.sol";

contract TimedMediaRelease is AbstractBlocklockReceiver {
```

Two imports. One inheritance. But they unlock the entire blocklock infrastructure.

**AbstractBlocklockReceiver** is your bridge to dcipher's network. Inherit from it and you get:

- `_requestBlocklockPayInNative()` - Function to kick off decryption requests
- Callback routing - dcipher calls your contract, base contract verifies and routes to your override
- Payment calculation - Figures out how much ETH you need for callback gas
- Access control - Makes sure only legitimate dcipher contracts can trigger callbacks

You're not building the protocol layer. That's already done. You're building the application layer on top.

**TypesLib** provides the `Ciphertext` structure:

```solidity
struct Ciphertext {
    bytes u;  // Elliptic curve point
    bytes v;  // Encrypted data
    bytes w;  // Authentication
}
```

This is the standard format for blocklock ciphertexts. Three components derived from IBE encryption. The library defines it so every contract speaks the same language.

Without these imports, you'd need to implement network communication protocols, cryptographic verification, payment routing, callback handling, ciphertext parsing—hundreds of lines.

With them? You override one function and focus on your application logic.

### The MediaRelease Struct

```solidity
struct MediaRelease {
    uint256 id;
    address uploader;
    string ipfsHash;
    uint256 revealBlock;
    string mediaType;
    uint256 fileSize;
    bool decrypted;
    bytes decryptionKey;
    uint256 createdAt;
}
```

Think of this as a state machine. A media release moves through phases, and the struct tracks where it is.

When someone uploads media, these fields populate: `id` (sequential identifier, auto-increments), `uploader` (the address that created this release from msg.sender), `ipfsHash` (content identifier pointing to encrypted bytes on IPFS), `revealBlock` (target block number when decryption becomes possible), `mediaType` (MIME type string like "video/mp4" or "image/png" for frontend rendering), `fileSize` (byte count, helps estimate download time), and `createdAt` (block timestamp for sorting/filtering).

At this stage: `decrypted = false`, `decryptionKey = empty bytes`.

Then nothing changes. The struct just sits there. Time passes. Blocks mine. Eventually we reach `revealBlock`.

When someone requests decryption, dcipher calls back. Now these fields update: `decrypted` flips to `true`, and `decryptionKey` gets populated with the actual key bytes.

The struct now contains everything needed to decrypt the IPFS content client-side.

Notice what's NOT here: the actual encrypted media bytes. Those never touch the blockchain. Only metadata lives on-chain.

### State Variables: The Storage Layer

```solidity
uint256 public mediaCounter;
mapping(uint256 => MediaRelease) public releases;
mapping(address => uint256[]) public userReleases;
mapping(uint256 => uint256) public requestToMediaId;
```

Four storage variables. Each solves a specific access pattern.

**mediaCounter** handles sequential ID generation. Starts at 0. Every new release increments it. First upload gets ID 0. Second gets ID 1. Forever counting up.

Why not random IDs? Because sequential IDs make queries predictable. Frontends can iterate: "fetch media 0, 1, 2…" until they hit the end. With random IDs, you'd need to maintain a separate index.

**releases** is the main registry. Map from ID to MediaRelease struct. This is the source of truth. `releases[42]` returns all data about media ID 42. Every query ultimately reads from this mapping.

**userReleases** maps addresses to arrays of media IDs they've uploaded. Why separate from `releases`? Because of query patterns. Frontends need "show me Alice's uploads." Without this index, you'd scan every media ID checking if `uploader == alice`. With 10,000 media releases, that's 10,000 lookups.

This index makes it O(1): `userReleases[alice]` returns her media IDs instantly. When someone uploads media, we do `userReleases[msg.sender].push(mediaId)`. Small gas cost at upload time, massive savings at query time.

**requestToMediaId** connects request IDs to media IDs. When you request decryption, dcipher assigns a `requestId`. When they callback, they only provide that `requestId`—not the media ID.

This mapping connects them: `requestToMediaId[requestId] = mediaId`. Callback arrives with `requestId=999`? Look up: `mediaId = requestToMediaId[999]`. Now we know which media to update.

Without this mapping, callbacks would need to include media IDs, requiring extra calldata and complicating the protocol.

### Events: The Notification System

```solidity
event MediaCreated(
    uint256 indexed id,
    address indexed uploader,
    string ipfsHash,
    uint256 revealBlock,
    uint256 fileSize
);
event DecryptionRequested(uint256 indexed mediaId, uint256 requestId);
event MediaDecrypted(
    uint256 indexed mediaId,
    bytes decryptionKey
);
```

Events are the contract’s way of broadcasting state changes. Think of them as webhooks for the blockchain.

**MediaCreated** fires when `createMediaRelease` executes successfully. Contains everything a frontend needs to display the new media: which ID was assigned, who uploaded it, where to fetch encrypted bytes (IPFS hash), when it unlocks (reveal block), and how large it is. Frontends watching this event can immediately add the media to their UI. No polling. No refresh. Instant update.

**DecryptionRequested** fires when someone calls `requestMediaDecryption`. Tells frontends: "decryption is in progress, dcipher is working on it." UI can show a spinner or "Decrypting…" message. Users know something's happening.

**MediaDecrypted** is the big one. Fires when dcipher delivers the decryption key. Contains the key itself. Frontends watching this can fetch encrypted media from IPFS, decrypt it client-side using the provided key, and render the video/image immediately. No additional blockchain queries needed. Everything required to decrypt is in the event.

Notice the `indexed` keyword on mediaId and uploader? That makes these fields searchable. Without it: "Give me all MediaCreated events" → Download every event, filter client-side. With it: "Give me all MediaCreated events where uploader = 0x123" → Blockchain filters before sending. Massive bandwidth savings. Standard practice for IDs and addresses.

### The Constructor: Linking to dcipher

```solidity
constructor(address _blocklockSender) AbstractBlocklockReceiver(_blocklockSender) {}
```

One line. One parameter. But it determines who can trigger decryption callbacks.

The `_blocklockSender` address is dcipher's deployed contract for your target chain. This contract processes decryption requests and delivers keys.

Base Sepolia: `0x82Fed730CbdeC5A2D8724F2e3b316a70A565e27e`  
Ethereum mainnet: Different address (check docs)  
Arbitrum: Different address  
…and so on.

When you deploy, you hardcode this address. The base constructor stores it. Forever.

Why? Security. When callbacks arrive, the base contract checks: "Is this call coming from the address I trust?" If not, revert.

This prevents random contracts calling your callback, malicious actors providing fake decryption keys, and attackers triggering unwanted state changes.

The address is immutable. Once deployed, you can't change which BlocklockSender you trust. If you need to update, you'd deploy a new contract.

Choose carefully at deployment time.

---

## Creating Media Releases: Registration Logic

Now the actual functions. Let's start with how media enters the system:

```solidity
function createMediaRelease(
    string calldata ipfsHash,
    uint256 revealBlock,
    string calldata mediaType,
    uint256 fileSize
) external returns (uint256 mediaId) {
    require(bytes(ipfsHash).length > 0, "Invalid IPFS hash");
    require(revealBlock > block.number, "Must be future block");
    require(fileSize > 0, "Invalid file size");

    mediaId = mediaCounter++;

    MediaRelease storage release = releases[mediaId];
    release.id = mediaId;
    release.uploader = msg.sender;
    release.ipfsHash = ipfsHash;
    release.revealBlock = revealBlock;
    release.mediaType = mediaType;
    release.fileSize = fileSize;
    release.createdAt = block.timestamp;

    userReleases[msg.sender].push(mediaId);

    emit MediaCreated(mediaId, msg.sender, ipfsHash, revealBlock, fileSize);
}
```

This function does one job: record that encrypted media exists somewhere else. It's a registry entry, not a storage mechanism.

Let's trace the flow.

The inputs are straightforward. `ipfsHash` is the content identifier for IPFS—looks like "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco". This string tells anyone where to download the encrypted bytes. `revealBlock` is the block number when decryption becomes possible—simple integer like 150,000. `mediaType` is a standard MIME type like "video/mp4" or "audio/mpeg" or "image/jpeg" that tells browsers how to handle the decrypted data. `fileSize` is total bytes so the frontend can show "Downloading 52.3 MB…"

The safety checks are important. Empty strings aren't valid IPFS hashes—this catches accidental blank inputs. Not foolproof (someone could pass garbage like "xyz123") but that only hurts themselves since no one could retrieve the file.

Here's the critical check: you MUST target a future block. Why? The decryption key derives from that block's signature. If block 150,000 already exists, its signature is public. Anyone could compute the key right now. The time-lock would be broken. Past or present blocks = instant decryption = defeated purpose. Only future blocks work because their signatures don't exist yet.

Zero-byte files don't make sense either—catches obviously wrong inputs.

ID generation uses post-increment. First media gets ID 0, and counter becomes 1. Second media gets ID 1, and counter becomes 2. Simple incrementing counter. No gaps, no randomness, just sequential IDs.

For storage, we're creating a storage pointer to a new MediaRelease struct, then filling in all the fields. The `uploader` is `msg.sender`—whoever called this function is the uploader. No way to forge this. The EVM enforces it.

The `ipfsHash` is copied directly from the calldata parameter. The contract doesn't validate it. Doesn't try to fetch from IPFS. Just stores it as-is. Why no validation? Because validation is impossible. The contract can't access IPFS. It has no way to verify the hash points to real data. We trust the uploader to provide a valid hash. If they provide a fake hash, they're only hurting themselves—no one will be able to retrieve their media later.

The indexing step adds this media ID to the uploader's list with `userReleases[msg.sender].push(mediaId)`. This makes queries easy. "Show me Alice's media" just reads `userReleases[alice]`, returns an array of IDs, then you fetch each MediaRelease struct from the `releases` mapping.

Finally, we emit the event. Frontends listening for this event immediately know new media exists. They can update their UI without waiting for the next polling cycle. The event includes all the key information: who uploaded it, where to find it, when it unlocks, how big it is.

And that's it. Media is created. IPFS hash is on-chain. Uploader is indexed. Event is emitted. The media is locked until the reveal block arrives.

---

## Requesting Decryption: The Unlock Trigger

Time passes. Blocks get mined. Eventually, the reveal block arrives. Now anyone can request decryption:

```solidity
function requestMediaDecryption(
    uint256 mediaId,
    uint32 callbackGasLimit,
    TypesLib.Ciphertext calldata ciphertext
) external payable {
    MediaRelease storage media = releases[mediaId];

    require(media.uploader != address(0), "Media doesn't exist");
    require(block.number >= media.revealBlock, "Not yet unlockable");
    require(!media.decrypted, "Already decrypted");

    bytes memory condition = abi.encodePacked(
        bytes1(0x42),
        abi.encode(media.revealBlock)
    );

    (uint256 requestId, uint256 requestPrice) = _requestBlocklockPayInNative(
        callbackGasLimit,
        condition,
        ciphertext
    );

    require(msg.value >= requestPrice, "Insufficient payment");

    requestToMediaId[requestId] = mediaId;

    emit DecryptionRequested(mediaId, requestId);
}

This function has more going on. Let's break it down.

The inputs: `mediaId` tells us which media to decrypt. `callbackGasLimit` is how much gas the callback can use—usually 200,000 is plenty. This determines how much ETH you need to send. `ciphertext` is interesting—you pass the ciphertext again. Why? Because dcipher's network needs it to perform the decryption. They can't read your contract's storage. You provide the ciphertext in the request.

But wait—the ciphertext is on IPFS, not on-chain. So the frontend needs to fetch encrypted media from IPFS, parse it into the Ciphertext structure, and pass it to this function. The contract doesn't fetch from IPFS. That happens off-chain.

For validation, if `uploader` is address(0), this media ID was never created. The default value for address in Solidity is address(0). Simple existence check.

Can't decrypt before the target block. Even if you tried, dcipher's network would refuse. The key can't be derived yet. But we check on-chain anyway to save users from wasting gas on requests that will definitely fail.

Can't decrypt twice either. Once it's revealed, it's done. Why prevent this? To save gas and prevent spam. If someone could repeatedly request decryption for the same media, they could drain ETH or flood the system with redundant callbacks.

The condition encoding is interesting. The `0x42` prefix means "this is a block-based condition." It's a signal to the dcipher network saying "check if this block has been reached." Then we encode the actual block number. Together, this says: "Decrypt this ciphertext once block number X has been mined."

