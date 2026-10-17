const sepolia = 11155111;

export const config = {
  contractAddress: import.meta.env.VITE_REGISTRY_ADDRESS || "0xfe852C0D1AEA7F5fC4947eb59AE1B9Dc264AdCDf",
  chainId: Number(import.meta.env.VITE_CHAIN_ID || sepolia),
  chainName: "Sepolia",
  pinataJwt: import.meta.env.VITE_PINATA_JWT || "",
  ipfsGateway: (import.meta.env.VITE_IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/").replace(
    /\/?$/,
    "/",
  ),
};

export function pinataConfigured() {
  return Boolean(config.pinataJwt);
}
