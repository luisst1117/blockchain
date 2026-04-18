// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyToken is ERC721, Ownable {

    uint256 public nextTokenId;

    struct Property {
        string location;
        uint256 value;
        bool forSale;
    }

    mapping(uint256 => Property) public properties;

    constructor()
        ERC721("PropertyToken", "PROP")
        Ownable(msg.sender)
    {}

    function mintProperty(
        address to,
        string memory location,
        uint256 value
    ) external onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId++;

        _safeMint(to, tokenId);
        properties[tokenId] = Property(location, value, false);
    }
}
