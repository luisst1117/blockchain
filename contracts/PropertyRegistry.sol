// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PropertyRegistry
 * @author Luis Stiven Ramirez Lopez
 * @notice Registro y trazabilidad de inmuebles usando Blockchain + IPFS
 * @dev Cada propiedad es representada como un NFT (ERC721)
 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyRegistry is ERC721, Ownable {

    /// @notice Estados posibles del inmueble
    enum PropertyStatus {
        Registrado,
        Validado,
        Transferido
    }

    /// @notice Estructura de la propiedad
    struct Property {
        uint256 id;              // ID del inmueble (NFT)
        address owner;           // Propietario actual
        string ipfsHash;         // Hash IPFS con metadata JSON
        PropertyStatus status;   // Estado del inmueble
        uint256 createdAt;       // Fecha de registro
    }

    /// @notice Contador de propiedades (NFTs)
    uint256 private tokenCounter;

    /// @notice Almacén de propiedades
    mapping(uint256 => Property) private properties;

    /// @notice Direcciones autorizadas para validar
    mapping(address => bool) public validators;

    /// @notice Eventos (auditoría y trazabilidad)
    event PropertyRegistered(
        uint256 indexed propertyId,
        address indexed owner,
        string ipfsHash
    );

    event PropertyValidated(
        uint256 indexed propertyId,
        address indexed validator
    );

    event PropertyTransferred(
        uint256 indexed propertyId,
        address indexed from,
        address indexed to
    );

    constructor() ERC721("PropertyToken", "PROP") Ownable(msg.sender) {}

    // =========================
    // 👮‍♂️ VALIDADORES
    // =========================

    function setValidator(address _validator, bool _status)
        external
        onlyOwner
    {
        validators[_validator] = _status;
    }

    // =========================
    // 🏠 REGISTRO DE PROPIEDAD
    // =========================

    function registerProperty(string memory _ipfsHash) external {
        require(bytes(_ipfsHash).length > 0, "IPFS hash invalido");

        tokenCounter++;
        uint256 newPropertyId = tokenCounter;

        _safeMint(msg.sender, newPropertyId);

        properties[newPropertyId] = Property({
            id: newPropertyId,
            owner: msg.sender,
            ipfsHash: _ipfsHash,
            status: PropertyStatus.Registrado,
            createdAt: block.timestamp
        });

        emit PropertyRegistered(newPropertyId, msg.sender, _ipfsHash);
    }

    // =========================
    // ✅ VALIDAR PROPIEDAD
    // =========================

    function validateProperty(uint256 _propertyId) external {
        require(validators[msg.sender], "No autorizado para validar");
        require(_ownerOf(_propertyId) != address(0), "Propiedad no existe");
        require(
            properties[_propertyId].status == PropertyStatus.Registrado,
            "Estado invalido"
        );

        properties[_propertyId].status = PropertyStatus.Validado;

        emit PropertyValidated(_propertyId, msg.sender);
    }

    // =========================
    // 🔄 TRANSFERIR PROPIEDAD
    // =========================

    function transferProperty(uint256 _propertyId, address _to) external {
        require(ownerOf(_propertyId) == msg.sender, "No es el propietario");
        require(_to != address(0), "Direccion invalida");

        safeTransferFrom(msg.sender, _to, _propertyId);

        properties[_propertyId].owner = _to;
        properties[_propertyId].status = PropertyStatus.Transferido;

        emit PropertyTransferred(_propertyId, msg.sender, _to);
    }

    // =========================
    // 🔍 CONSULTAR PROPIEDAD
    // =========================

    function getProperty(uint256 _propertyId)
        external
        view
        returns (
            uint256 id,
            address owner,
            string memory ipfsHash,
            PropertyStatus status,
            uint256 createdAt
        )
    {
        require(_ownerOf(_propertyId) != address(0), "Propiedad no existe");

        Property memory p = properties[_propertyId];
        return (p.id, p.owner, p.ipfsHash, p.status, p.createdAt);
    }
}
