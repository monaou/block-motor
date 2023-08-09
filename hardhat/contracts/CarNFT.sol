pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract CarNFT is ERC721Enumerable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct NFTData {
        string name;
        uint256 unique_id;
    }

    // tokenId to NFTData
    mapping(uint256 => NFTData) public nftDataMap;

    // unique_id to owner addresses
    mapping(uint256 => address[]) public uniqueIdOwners;

    constructor() ERC721('MyNFT', 'MNFT') {}

    function mint(address recipient, string memory name, uint256 uniqueId) public returns (uint256) {
        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(recipient, newTokenId);

        NFTData memory newData = NFTData(name, uniqueId);
        nftDataMap[newTokenId] = newData;

        uniqueIdOwners[uniqueId].push(recipient);

        return newTokenId;
    }

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);

        uint256[] memory tokenIdList = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIdList[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIdList;
    }

    function getOwnersByUniqueId(uint256 uniqueId) external view returns (address[] memory) {
        return uniqueIdOwners[uniqueId];
    }
}
