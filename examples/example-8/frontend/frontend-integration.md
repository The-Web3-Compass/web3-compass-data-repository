
## The Frontend: Making Complexity Feel Simple

Users don’t care about block numbers and IBE cryptography and IPFS hashes. They want to upload a video and set a release date.

So the frontend hides all the complexity behind clean interfaces.

**The Upload Flow**

```tsx
const handleUpload = async () => {
  // Step 1: Calculate target block from date
  const targetBlock = dateToBlock(new Date(releaseDate), currentBlock);

  // Step 2: Read file into memory
  const fileBuffer = await file.arrayBuffer();

  // Step 3: Encrypt with blocklock
  const blocklock = Blocklock.createFromChainId(provider, chainId);
  const encrypted = blocklock.encrypt(
    new Uint8Array(fileBuffer),
    BigInt(targetBlock)
  );

  // Step 4: Upload to IPFS
  const ipfsHash = await uploadToIPFS(encrypted);

  // Step 5: Store metadata on-chain
  const tx = await contract.createMediaRelease(
    ipfsHash,
    targetBlock,
    file.type,
    file.size
  );
  await tx.wait();
};
```

Five steps. But the user just sees “Uploading…” then “Success!”

**The Decryption Flow**

```tsx
const handleDecrypt = async () => {
  // Step 1: Fetch encrypted data from IPFS
  const encryptedBuffer = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`)
    .then(res => res.arrayBuffer());

  // Step 2: Convert to Ciphertext structure
  const ciphertext = parseCiphertext(encryptedBuffer);

  // Step 3: Request decryption on-chain
  const tx = await contract.requestMediaDecryption(
    mediaId,
    200000, // callback gas limit
    ciphertext,
    { value: parseEther("0.001") }
  );
  await tx.wait();

  // Step 4: Wait for callback (automatically triggers event)
  // Frontend watches for MediaDecrypted event

  // Step 5: Once event fires, fetch key and decrypt
  const key = await contract.getDecryptionKey(mediaId);
  const decrypted = blocklock.decrypt(encryptedBuffer, key);

  // Step 6: Create viewable blob
  const blob = new Blob([decrypted], { type: mediaType });
  const url = URL.createObjectURL(blob);
  videoElement.src = url;
};
```

Six steps. User sees “Requesting key…” then the video starts playing.

All the complexity is hidden. Blockchain interactions feel like normal app functionality.

---

## Use Cases: Why Time-Lock Media

Picture this: you're launching a product. You've got a demo video ready to go, but the announcement isn't until next week. You want press to have early access to download the file, but you absolutely cannot risk leaks. With time-locked media, you encrypt the video targeting the announcement block, share the IPFS link publicly days before launch, and press can download early but can't watch until announcement time. No leaks possible. The key literally doesn't exist until the blockchain produces it.

Or think about educational content. You're running an online course with weekly modules. You want students to see that Week 2 content exists (builds anticipation, shows the course structure), but you don't want them accessing it until Week 2 actually starts. Lock each module to specific blocks. Students can see the encrypted files, know what's coming, but can't skip ahead. Enforces sequential learning without you manually releasing content every week.

Here's a wild one: NFT reveals. Mint NFTs with encrypted metadata. Set reveal blocks weeks later. Holders trade without knowing what they own. When reveal hits, everyone discovers simultaneously. No insider information. No early reveals for whales. Pure chaos and excitement. The metadata could be images, traits, unlockable content—anything. All encrypted until the exact same block.

Dead man's switch scenarios get interesting too. Encrypt sensitive documents targeting 6 months out. Every month, you update the target block to push it further into the future. If you stop resetting (because you're incapacitated, arrested, or worse), the documents auto-release. No one holds keys to be compelled. No trusted third parties. Just math and blockchain finality.
