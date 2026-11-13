import { ethers } from "ethers";
import { config } from "../config";
import { registryAbi } from "./abi";
import { ensureChain } from "./network";

function ethereum() {
  if (!window.ethereum) {
    throw new Error("Necesitas una cuenta digital en el navegador para continuar");
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
  if (config.contractAddress === ethers.ZeroAddress) {
    throw new Error("La dirección del registro no es válida");
  }
  return contract(getBrowserProvider());
}

export async function registryWrite() {
  if (config.contractAddress === ethers.ZeroAddress) {
    throw new Error("La dirección del registro no es válida");
  }
  const provider = getBrowserProvider();
  await ensureChain(provider);
  const signer = await provider.getSigner();
  return contract(signer);
}

export async function waitTx(sent) {
  const tx = await sent;
  return tx.wait();
}
