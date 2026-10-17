export const registryAbi = [
  "function registerProperty(string ipfsHash)",
  "function validateProperty(uint256 propertyId)",
  "function transferProperty(uint256 propertyId, address to)",
  "function setValidator(address validator, bool allowed)",
  "event PropertyRegistered(uint256 indexed propertyId, address indexed owner, string ipfsHash)",
  "function getProperty(uint256 propertyId) view returns (uint256 id, address owner, string ipfsHash, uint8 status, uint256 createdAt)",
  "function totalProperties() view returns (uint256)",
  "function validators(address) view returns (bool)",
  "function owner() view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
];
