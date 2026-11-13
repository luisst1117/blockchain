import { ethers } from "ethers";
import { getBrowserProvider } from "./client";
import { ensureChain } from "./network";

export async function connectWallet() {
  const provider = getBrowserProvider();
  await provider.send("eth_requestAccounts", []);
  await ensureChain(provider);
  const signer = await provider.getSigner();
  return signer.getAddress();
}

export async function restoreWallet() {
  if (!window.ethereum) return "";
  const provider = getBrowserProvider();
  const accounts = await provider.send("eth_accounts", []);
  if (!accounts[0]) return "";
  await ensureChain(provider);
  return accounts[0];
}

export function watchWallet(onAccount) {
  const eth = window.ethereum;
  if (!eth?.on) return () => {};

  const onAccounts = (accounts) => onAccount(accounts[0] || "");
  const onChain = () => window.location.reload();

  eth.on("accountsChanged", onAccounts);
  eth.on("chainChanged", onChain);

  return () => {
    eth.removeListener?.("accountsChanged", onAccounts);
    eth.removeListener?.("chainChanged", onChain);
  };
}

export function shortAddress(addr) {
  if (!addr) return "";
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function sameAddress(a, b) {
  if (!a || !b) return false;
  try {
    return ethers.getAddress(a) === ethers.getAddress(b);
  } catch {
    return false;
  }
}
