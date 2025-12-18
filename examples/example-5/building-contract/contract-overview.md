# Building the RandomTraitsNFT Contract

Time to write some Solidity. We're building `RandomTraitsNFT.sol`—an ERC721 contract that requests randomness from dcipher when someone mints, then assigns traits when the callback arrives.

## The Complete Contract

Create `contracts/RandomTraitsNFT.sol`:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import {RandomnessReceiverBase} from "randomness-solidity/src/RandomnessReceiverBase.sol";

contract RandomTraitsNFT is ERC721, RandomnessReceiverBase {
    using Strings for uint256;

    // ============ State Variables ============

    uint256 public nextTokenId;
    uint256 public maxSupply = 100;

    // Mapping: tokenId => randomness request ID
    mapping(uint256 => uint256) public tokenToRequestId;

    // Mapping: request ID => tokenId
    mapping(uint256 => uint256) public requestIdToToken;

    // Mapping: tokenId => random seed
    mapping(uint256 => bytes32) public tokenTraitSeed;

    // ============ Events ============

    event NFTMinted(uint256 indexed tokenId, address indexed minter, uint256 requestId);
    event TraitsRevealed(uint256 indexed tokenId, bytes32 randomSeed);

    // ============ Constructor ============

    constructor(
        address _randomnessSender,
        address _owner
    )
        ERC721("Random Shapes", "SHAPES")
        RandomnessReceiverBase(_randomnessSender, _owner)
    {}

    // ============ Minting ============

    function mint(uint32 callbackGasLimit) external payable returns (uint256) {
        require(nextTokenId < maxSupply, "Max supply reached");

        uint256 tokenId = nextTokenId;
        nextTokenId++;

        // Mint the NFT to the caller
        _safeMint(msg.sender, tokenId);

        // Request randomness from dcipher
        (uint256 requestId, ) = _requestRandomnessPayInNative(callbackGasLimit);

        // Store the mapping between token and request
        tokenToRequestId[tokenId] = requestId;
        requestIdToToken[requestId] = tokenId;

        emit NFTMinted(tokenId, msg.sender, requestId);

        return tokenId;
    }

    // ============ Randomness Callback ============

    function onRandomnessReceived(
        uint256 requestId,
        bytes32 randomness
    ) internal override {
        uint256 tokenId = requestIdToToken[requestId];

        require(tokenId < nextTokenId, "Invalid token ID");
        require(tokenTraitSeed[tokenId] == bytes32(0), "Traits already revealed");

        // Store the random seed for this token
        tokenTraitSeed[tokenId] = randomness;

        emit TraitsRevealed(tokenId, randomness);
    }

    // ============ Trait Derivation ============

    function getTraits(uint256 tokenId) public view returns (
        string memory shape,
        string memory color,
        string memory size
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        bytes32 seed = tokenTraitSeed[tokenId];

        if (seed == bytes32(0)) {
            return ("Revealing", "Revealing", "Revealing");
        }

        // Derive traits from random seed
        uint256 randomValue = uint256(seed);

        // Shape (5 options: 0-4)
        uint256 shapeIndex = randomValue % 5;
        string[5] memory shapes = ["Circle", "Square", "Triangle", "Pentagon", "Hexagon"];
        shape = shapes[shapeIndex];

        // Color (8 options: 0-7)
        uint256 colorIndex = (randomValue / 5) % 8;
        string[8] memory colors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "Pink", "Cyan"];
        color = colors[colorIndex];

        // Size (4 options: 0-3)
        uint256 sizeIndex = (randomValue / 40) % 4;
        string[4] memory sizes = ["Small", "Medium", "Large", "Huge"];
        size = sizes[sizeIndex];
    }

    // ============ Metadata ============

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        (string memory shape, string memory color, string memory size) = getTraits(tokenId);

        // Generate SVG
        string memory svg = generateSVG(shape, color, size);

        // Build metadata JSON
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Random Shape #',
                        tokenId.toString(),
                        '", "description": "An NFT with traits determined by dcipher threshold randomness", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(svg)),
                        '", "attributes": [',
                        '{"trait_type": "Shape", "value": "', shape, '"},',
                        '{"trait_type": "Color", "value": "', color, '"},',
                        '{"trait_type": "Size", "value": "', size, '"',
                        '}]}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    function generateSVG(
        string memory shape,
        string memory color,
        string memory size
    ) internal pure returns (string memory) {
        // Map color names to hex values
        string memory colorHex = getColorHex(color);

        // Map size to dimensions
        uint256 dimension = getSizeDimension(size);

        // Calculate center position
        uint256 cx = 150;
        uint256 cy = 150;

        string memory shapeElement;

        if (keccak256(bytes(shape)) == keccak256(bytes("Circle"))) {
            shapeElement = string(
                abi.encodePacked(
                    '<circle cx="', cx.toString(), '" cy="', cy.toString(),
                    '" r="', (dimension / 2).toString(), '" fill="', colorHex, '"/>'
                )
            );
        } else if (keccak256(bytes(shape)) == keccak256(bytes("Square"))) {
            uint256 x = cx - (dimension / 2);
            uint256 y = cy - (dimension / 2);
            shapeElement = string(
                abi.encodePacked(
                    '<rect x="', x.toString(), '" y="', y.toString(),
                    '" width="', dimension.toString(), '" height="', dimension.toString(),
                    '" fill="', colorHex, '"/>'
                )
            );
        } else if (keccak256(bytes(shape)) == keccak256(bytes("Triangle"))) {
            uint256 halfBase = dimension / 2;
            uint256 height = (dimension * 866) / 1000; // Approximate equilateral triangle height
            shapeElement = string(
                abi.encodePacked(
                    '<polygon points="', cx.toString(), ',', (cy - (height * 2 / 3)).toString(),
                    ' ', (cx - halfBase).toString(), ',', (cy + (height / 3)).toString(),
                    ' ', (cx + halfBase).toString(), ',', (cy + (height / 3)).toString(),
                    '" fill="', colorHex, '"/>'
                )
            );
        } else {
            // Default to Pentagon or Hexagon (simplified as circles for this example)
            shapeElement = string(
                abi.encodePacked(
                    '<circle cx="', cx.toString(), '" cy="', cy.toString(),
                    '" r="', (dimension / 2).toString(), '" fill="', colorHex, '"/>'
                )
            );
        }

        return string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">',
                '<rect width="300" height="300" fill="#f0f0f0"/>',
                shapeElement,
                '</svg>'
            )
        );
    }

    function getColorHex(string memory color) internal pure returns (string memory) {
        if (keccak256(bytes(color)) == keccak256(bytes("Red"))) return "#FF0000";
        if (keccak256(bytes(color)) == keccak256(bytes("Blue"))) return "#0000FF";
        if (keccak256(bytes(color)) == keccak256(bytes("Green"))) return "#00FF00";
        if (keccak256(bytes(color)) == keccak256(bytes("Yellow"))) return "#FFFF00";
        if (keccak256(bytes(color)) == keccak256(bytes("Purple"))) return "#800080";
        if (keccak256(bytes(color)) == keccak256(bytes("Orange"))) return "#FFA500";
        if (keccak256(bytes(color)) == keccak256(bytes("Pink"))) return "#FFC0CB";
        if (keccak256(bytes(color)) == keccak256(bytes("Cyan"))) return "#00FFFF";
        return "#CCCCCC"; // Default gray for "Revealing"
    }

    function getSizeDimension(string memory size) internal pure returns (uint256) {
        if (keccak256(bytes(size)) == keccak256(bytes("Small"))) return 40;
        if (keccak256(bytes(size)) == keccak256(bytes("Medium"))) return 70;
        if (keccak256(bytes(size)) == keccak256(bytes("Large"))) return 100;
        if (keccak256(bytes(size)) == keccak256(bytes("Huge"))) return 130;
        return 50; // Default for "Revealing"
    }
}
```

---

## Contract Breakdown

Let's walk through this contract section by section.

### Imports and Inheritance

```solidity
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import {RandomnessReceiverBase} from "randomness-solidity/src/RandomnessReceiverBase.sol";

contract RandomTraitsNFT is ERC721, RandomnessReceiverBase {
```

Nothing fancy here:

- **ERC721** gives us all the NFT plumbing: ownership, transfers, `tokenURI`, `_safeMint`, etc.
- **RandomnessReceiverBase** is the dcipher glue. It handles verification and routing so we only care about *what to do* once randomness arrives.
- **Strings** and **Base64** are for metadata generation: numbers to strings, SVG to base64, JSON to data URIs.

---

### State Variables

```solidity
uint256 public nextTokenId;
uint256 public maxSupply = 100;

mapping(uint256 => uint256) public tokenToRequestId;
mapping(uint256 => uint256) public requestIdToToken;
mapping(uint256 => bytes32) public tokenTraitSeed;
```

These variables exist because **the mint and the randomness callback happen at different times**.

- `nextTokenId` — keeps minting simple, token IDs are sequential
- `maxSupply` — caps the collection at 100 NFTs
- `tokenToRequestId` and `requestIdToToken` — bridge between worlds (we know token ID at mint, only request ID at callback)
- `tokenTraitSeed` — **the important one**. Once set, the NFT's traits are locked in forever

If `tokenTraitSeed[tokenId]` is zero → NFT is still "revealing"
If it's non-zero → randomness has landed, traits are final

---

### The Constructor

```solidity
constructor(
    address _randomnessSender,
    address _owner
)
    ERC721("Random Shapes", "SHAPES")
    RandomnessReceiverBase(_randomnessSender, _owner)
{}
```

Minimal by design:
- Name the NFT collection
- Tell `RandomnessReceiverBase` where dcipher's `RandomnessSender` contract lives
- Done

No admin logic. No owner-only minting. No hidden switches. This example is about *randomness*, not governance.

---

### The Mint Function

```solidity
function mint(uint32 callbackGasLimit) external payable returns (uint256) {
    require(nextTokenId < maxSupply, "Max supply reached");

    uint256 tokenId = nextTokenId;
    nextTokenId++;

    // Mint the NFT to the caller
    _safeMint(msg.sender, tokenId);

    // Request randomness from dcipher
    (uint256 requestId, ) = _requestRandomnessPayInNative(callbackGasLimit);

    // Store the mapping between token and request
    tokenToRequestId[tokenId] = requestId;
    requestIdToToken[requestId] = tokenId;

    emit NFTMinted(tokenId, msg.sender, requestId);

    return tokenId;
}
```

This is the only function users ever call.

Notice what *doesn't* happen here:
- We don't calculate traits
- We don't touch randomness values
- We don't try to be clever

All this function does:
1. Mint the NFT immediately
2. Ask dcipher for randomness
3. Remember how to link the two later

At the end of this transaction, the NFT exists and is owned—but its traits are intentionally undefined. **That gap is what keeps the mint unpredictable.**

---

### The Randomness Callback

```solidity
function onRandomnessReceived(
    uint256 requestId,
    bytes32 randomness
) internal override {
    uint256 tokenId = requestIdToToken[requestId];

    require(tokenId < nextTokenId, "Invalid token ID");
    require(tokenTraitSeed[tokenId] == bytes32(0), "Traits already revealed");

    // Store the random seed for this token
    tokenTraitSeed[tokenId] = randomness;

    emit TraitsRevealed(tokenId, randomness);
}
```

This function is **never called by a wallet or frontend**. It's only invoked by dcipher *after* the threshold network has produced a valid random value.

Once this executes:
- The randomness is locked into contract storage
- The NFT's traits are permanently determined
- There is no way to override or reroll them

If you were looking for a place to cheat, this would be it—and the contract simply doesn't allow it.

---

## Key Security Properties

1. **Traits cannot be predicted** — randomness doesn't exist at mint time
2. **Traits cannot be manipulated** — threshold signature is verifiable
3. **Traits cannot be rerolled** — `require` prevents double-setting
4. **No admin backdoors** — no special functions to override traits

This is what "trustless" actually means. Not "we promise we're trustworthy," but "the math doesn't allow us to cheat even if we wanted to."
