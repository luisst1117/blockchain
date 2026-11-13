import { config } from "../config";

function hexChainId(id) {
  return `0x${id.toString(16)}`;
}

export async function ensureChain(provider) {
  const network = await provider.getNetwork();
  if (Number(network.chainId) === config.chainId) return;

  const chainId = hexChainId(config.chainId);

  try {
    await provider.send("wallet_switchEthereumChain", [{ chainId }]);
  } catch (err) {
    if (err.code !== 4902 && err.error?.code !== 4902) throw err;

    await provider.send("wallet_addEthereumChain", [
      {
        chainId,
        chainName: config.chainName,
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: ["https://rpc.sepolia.org"],
        blockExplorerUrls: ["https://sepolia.etherscan.io"],
      },
    ]);
  }
}
