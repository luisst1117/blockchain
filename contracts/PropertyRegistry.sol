// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyRegistry is ERC721, Ownable {
    enum PropertyStatus {
        Registrado,
        Validado,
        Transferido
    }

    struct Property {
        uint256 id;
        address owner;
        string ipfsHash;
        PropertyStatus status;
        uint256 createdAt;
    }

    uint256 private _nextId;
    mapping(uint256 => Property) private _properties;
    mapping(address => bool) public validators;

    event PropertyRegistered(uint256 indexed propertyId, address indexed owner, string ipfsHash);
    event PropertyValidated(uint256 indexed propertyId, address indexed validator);
    event PropertyTransferred(uint256 indexed propertyId, address indexed from, address indexed to);
    event ValidatorUpdated(address indexed validator, bool allowed);

    constructor() ERC721("PropertyToken", "PROP") Ownable(msg.sender) {}

    modifier onlyValidator() {
        require(validators[msg.sender], "No autorizado para validar");
        _;
    }

    function totalProperties() external view returns (uint256) {
        return _nextId;
    }

    function setValidator(address validator, bool allowed) external onlyOwner {
        require(validator != address(0), "Validador invalido");
        validators[validator] = allowed;
        emit ValidatorUpdated(validator, allowed);
    }

    function registerProperty(string calldata ipfsHash) external {
        require(bytes(ipfsHash).length > 0, "IPFS hash invalido");

        _nextId += 1;
        uint256 propertyId = _nextId;

        _safeMint(msg.sender, propertyId);
        _properties[propertyId] = Property({
            id: propertyId,
            owner: msg.sender,
            ipfsHash: ipfsHash,
            status: PropertyStatus.Registrado,
            createdAt: block.timestamp
        });

        emit PropertyRegistered(propertyId, msg.sender, ipfsHash);
    }

    function validateProperty(uint256 propertyId) external onlyValidator {
        _mustExist(propertyId);
        require(_properties[propertyId].status == PropertyStatus.Registrado, "Estado invalido");

        _properties[propertyId].status = PropertyStatus.Validado;
        emit PropertyValidated(propertyId, msg.sender);
    }

    function transferProperty(uint256 propertyId, address to) external {
        address from = ownerOf(propertyId);
        require(from == msg.sender, "No es el propietario");
        require(to != address(0), "Direccion invalida");
        require(to != from, "Destino igual al origen");

        _safeTransfer(from, to, propertyId, "");
    }

    function getProperty(uint256 propertyId)
        external
        view
        returns (uint256 id, address owner, string memory ipfsHash, PropertyStatus status, uint256 createdAt)
    {
        _mustExist(propertyId);
        Property storage item = _properties[propertyId];
        return (item.id, item.owner, item.ipfsHash, item.status, item.createdAt);
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        _requireOwned(tokenId);
        return _properties[tokenId].ipfsHash;
    }

    function _mustExist(uint256 propertyId) private view {
        require(_ownerOf(propertyId) != address(0), "Propiedad no existe");
    }

    // transferFrom, safeTransferFrom y transferProperty pasan por acá
    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        address from = super._update(to, tokenId, auth);

        if (from != address(0) && to != address(0)) {
            _properties[tokenId].owner = to;
            _properties[tokenId].status = PropertyStatus.Transferido;
            emit PropertyTransferred(tokenId, from, to);
        }

        return from;
    }
}
