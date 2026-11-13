import { ethers } from "ethers";

const sepolia = 11155111;
const fallback = "0xB0d4E610764B6ebb5f72DD94459026c68eE78C0B";

function safeGateway(raw) {
  const fallback = "https://gateway.pinata.cloud/ipfs/";
  const value = String(raw || fallback).trim();
  try {
    const url = new URL(value.endsWith("/") ? value : `${value}/`);
    if (url.protocol !== "https:") return fallback;
    return url.href;
  } catch {
    return fallback;
  }
}

function registryAddress() {
  const raw = import.meta.env.VITE_REGISTRY_ADDRESS || fallback;
  try {
    return ethers.getAddress(raw);
  } catch {
    return ethers.ZeroAddress;
  }
}

export const config = {
  contractAddress: registryAddress(),
  chainId: Number(import.meta.env.VITE_CHAIN_ID || sepolia),
  chainName: "Sepolia",
  pinataJwt: import.meta.env.VITE_PINATA_JWT || "",
  ipfsGateway: safeGateway(import.meta.env.VITE_IPFS_GATEWAY),
};

export function pinataConfigured() {
  return Boolean(config.pinataJwt);
}
