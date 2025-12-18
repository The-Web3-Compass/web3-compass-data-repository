# Viewing Your NFT in MetaMask

At this point, your NFT is already complete:
- The image is on-chain
- The metadata is on-chain
- The traits are locked in by threshold randomness

So instead of building a frontend right away, let's do the most honest verification possible: **look at the NFT directly in your wallet.**

No scripts. No UI. Just MetaMask and the chain.

---

## Step 1: Switch MetaMask to Base Sepolia

Open MetaMask and switch your active network to **Base Sepolia**.

This matters more than it sounds. MetaMask will only show NFTs that exist on the network you're currently connected to.

If you don't see Base Sepolia:
- Open MetaMask settings
- Go to **Networks**
- Enable test networks or manually add Base Sepolia

Once you're on Base Sepolia, you're looking at the same chain where your NFT contract lives.

---

## Step 2: Import the NFT Manually

Testnet NFTs don't always auto-appear, so we add it by hand.

1. Open MetaMask
2. Go to the **NFTs** tab
3. Click **Import NFT**

MetaMask will ask for two things:

- **NFT Address** → your deployed `RandomTraitsNFT` contract address
- **Token ID** → the token ID you minted (for example, `0`)

Paste those in and confirm.

---

## Step 3: Wait for the Reveal

If you import the NFT immediately after minting, you might see:
- A blank image
- A placeholder
- Or no visible traits yet

That's expected. The randomness callback may not have landed yet.

Give it **10–30 seconds**, then close and reopen MetaMask or switch tabs and come back.

At some point, without you doing anything else:
- The SVG image appears
- The shape, color, and size snap into place
- The NFT is fully revealed

**No reveal transaction. No button. No backend.**

Just on-chain state updating.

---

## Step 4: View on BaseScan

You can also view your NFT on BaseScan:

```
https://sepolia.basescan.org/token/YOUR_CONTRACT_ADDRESS?a=TOKEN_ID
```

Replace:
- `YOUR_CONTRACT_ADDRESS` with your deployed contract address
- `TOKEN_ID` with the token ID (e.g., `0`)

BaseScan will show:
- The owner
- The metadata
- The image
- All transfer history

---

## What You've Proven

By viewing the NFT in MetaMask and BaseScan, you've verified:

1. **The NFT exists on-chain** — it's in your wallet
2. **The traits are determined by randomness** — you couldn't predict them before minting
3. **The metadata is fully on-chain** — no IPFS, no external servers
4. **The image is generated on-chain** — pure SVG from contract storage
5. **The randomness is verifiable** — anyone can check the threshold signature

This is what "trustless NFTs" actually means. Not "trust the team," but "verify the math."

---

## Next: Build More Complex Projects

Now that you've seen the pattern work, you can extend it:
- Add more traits
- Implement weighted rarities
- Create dynamic traits that change over time
- Build multi-stage reveals

The rule is simple: **don't touch the randomness flow.**

Mint first. Randomness later. No shortcuts.

If you can keep that intact while making the NFT more interesting, you're doing it right.
