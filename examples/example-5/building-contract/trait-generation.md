# Trait Generation and Metadata

Now let's look at how we turn a single random value into multiple traits and generate fully on-chain metadata.

## Deriving Traits from Randomness

```solidity
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
```

### How This Works

This function doesn't mutate state. It just interprets it.

**One random seed becomes multiple independent traits** by slicing different parts of the entropy:

1. **Shape**: `randomValue % 5` gives us 0-4 (5 shapes)
2. **Color**: `(randomValue / 5) % 8` gives us 0-7 (8 colors)
3. **Size**: `(randomValue / 40) % 4` gives us 0-3 (4 sizes)

**Why divide before modulo?**

The division shifts which bits of the random value we're looking at. This prevents correlation between traits.

Without division:
- `randomValue % 5 = 3` (Triangle)
- `randomValue % 8 = 3` (Yellow)
- Traits would be correlated

With division:
- `randomValue % 5 = 3` (Triangle)
- `(randomValue / 5) % 8 = 6` (Pink)
- Traits are independent

**Gas-efficient, predictable, and easy to reason about.**

---

## Trait Distribution

With our setup:
- 5 shapes × 8 colors × 4 sizes = **160 possible combinations**
- Each combination has equal probability
- No artificial rarity weighting
- Pure randomness determines distribution

Some traits will be rarer than others purely by chance. That's how real randomness works.

---

## Fully On-Chain Metadata

```solidity
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
```

Everything—image, metadata, attributes—is returned directly from the contract.

**No URLs. No external dependencies. No IPFS gateways.**

Marketplaces already know how to handle this format, so the NFT just works.

---

## SVG Generation

```solidity
function generateSVG(
    string memory shape,
    string memory color,
    string memory size
) internal pure returns (string memory) {
    string memory colorHex = getColorHex(color);
    uint256 dimension = getSizeDimension(size);

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
        uint256 height = (dimension * 866) / 1000;
        shapeElement = string(
            abi.encodePacked(
                '<polygon points="', cx.toString(), ',', (cy - (height * 2 / 3)).toString(),
                ' ', (cx - halfBase).toString(), ',', (cy + (height / 3)).toString(),
                ' ', (cx + halfBase).toString(), ',', (cy + (height / 3)).toString(),
                '" fill="', colorHex, '"/>'
            )
        );
    } else {
        // Pentagon or Hexagon (simplified as circles)
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
```

The SVG isn't fancy—and that's intentional.

It exists to prove that the traits are:
- Derived on-chain
- Deterministic from the random seed
- Impossible to tamper with after reveal

**Randomness is the star here. Everything else is just scaffolding.**

---

## Helper Functions

```solidity
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
```

Simple mapping functions. Nothing clever. Just converting trait names to values the SVG renderer understands.

---

## Why This Pattern Works

1. **Single source of randomness** — one `bytes32` value per NFT
2. **Deterministic derivation** — same seed always produces same traits
3. **Independent traits** — division prevents correlation
4. **Fully on-chain** — no external dependencies
5. **Verifiable** — anyone can check the math

This is production-ready randomness for NFTs. The same pattern scales to:
- More complex trait systems
- Weighted rarities (if you want them)
- Dynamic traits that change based on randomness
- Multi-stage reveals

But the core principle stays the same: **get real randomness first, derive everything else from it.**
