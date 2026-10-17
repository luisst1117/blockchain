import { ethers } from "ethers";
import { config } from "../config";
import { registryAbi } from "./abi";

function ethereum() {
  if (!window.ethereum) {
    throw new Error("Necesitas MetaMask en el navegador");
  }
  return window.ethereum;
}

export function getBrowserProvider() {
  return new ethers.BrowserProvider(ethereum());
}

function contract(runner) {
  return new ethers.Contract(config.contractAddress, registryAbi, runner);
}

export async function registryRead() {
  return contract(getBrowserProvider());
}

export async function registryWrite() {
  const signer = await getBrowserProvider().getSigner();
  return contract(signer);
}

export async function waitTx(sent) {
  const tx = await sent;
  return tx.wait();
}
