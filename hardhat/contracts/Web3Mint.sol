// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/utils/Strings.sol';
import './libraries/Base64.sol';

contract Web3Mint is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct NftAttributes {
        string name;
        string imageURL;
        string car_unique_id;
        uint256 created_timestamp;
    }

    NftAttributes[] private Web3Nfts;

    constructor() ERC721('NFT', 'nft') {}

    function mintIpfsNFT(string memory name, string memory imageURI, string memory carId) public {
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        Web3Nfts.push(
            NftAttributes({name: name, imageURL: imageURI, car_unique_id: carId, created_timestamp: block.timestamp})
        );
        _tokenIds.increment();
    }

    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        Web3Nfts[_tokenId].name,
                        '", "id": "',
                        Strings.toString(_tokenId),
                        '", "description": "", "image": "ipfs://',
                        Web3Nfts[_tokenId].imageURL,
                        '", "car_unique_id": "',
                        Web3Nfts[_tokenId].car_unique_id,
                        '"}'
                    )
                )
            )
        );
        string memory output = string(abi.encodePacked('data:application/json;base64,', json));
        return output;
    }

    function getTokensByCarId(string memory carId) public view returns (uint256[] memory) {
        uint256 totalNfts = _tokenIds.current();
        uint256[] memory matchingTokens = new uint256[](totalNfts);

        uint256 counter = 0;
        for (uint256 i = 0; i < totalNfts; i++) {
            if (keccak256(abi.encodePacked(Web3Nfts[i].car_unique_id)) == keccak256(abi.encodePacked(carId))) {
                matchingTokens[counter] = i; // トークンのID（この場合は`i`）を配列に追加
                counter++;
            }
        }

        // Resize the array
        uint256[] memory resultTokens = new uint256[](counter);
        for (uint256 j = 0; j < counter; j++) {
            resultTokens[j] = matchingTokens[j];
        }

        return resultTokens;
    }
}
