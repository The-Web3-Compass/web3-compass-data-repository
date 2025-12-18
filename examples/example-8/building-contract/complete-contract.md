## The Complete Smart Contract

Here’s the entire contract. We’ll break down every piece after:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AbstractBlocklockReceiver} from "blocklock-solidity/src/AbstractBlocklockReceiver.sol";
import {TypesLib} from "blocklock-solidity/src/libraries/TypesLib.sol";

contract TimedMediaRelease is AbstractBlocklockReceiver {

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

    uint256 public mediaCounter;
    mapping(uint256 => MediaRelease) public releases;
    mapping(address => uint256[]) public userReleases;
    mapping(uint256 => uint256) public requestToMediaId;

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

    constructor(address _blocklockSender)
        AbstractBlocklockReceiver(_blocklockSender) {}

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

    function _onBlocklockReceived(
        uint256 requestId,
        bytes calldata decryptionKey
    ) internal override {
        uint256 mediaId = requestToMediaId[requestId];
        MediaRelease storage media = releases[mediaId];

        require(media.uploader != address(0), "Invalid media");
        require(!media.decrypted, "Already decrypted");

        media.decryptionKey = decryptionKey;
        media.decrypted = true;

        emit MediaDecrypted(mediaId, decryptionKey);
    }

    function getMediaRelease(uint256 id) external view returns (MediaRelease memory) {
        return releases[id];
    }

    function getUserReleases(address user) external view returns (uint256[] memory) {
        return userReleases[user];
    }

    function canDecrypt(uint256 mediaId) external view returns (bool) {
        MediaRelease storage media = releases[mediaId];
        return media.uploader != address(0) &&
               !media.decrypted &&
               block.number >= media.revealBlock;
    }
}
```

That’s the complete contract. Clean, focused, and it does exactly what we need.

Now let’s break it down piece by piece.

