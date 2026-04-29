import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xfe852C0D1AEA7F5fC4947eb59AE1B9Dc264AdCDf";

const ABI = [
  "function registerProperty(string)",
  "function validateProperty(uint256)"
];

async function getContract() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}

export async function connectWallet() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return await signer.getAddress();
}

export async function registerProperty(data) {
  const contract = await getContract();

  const metadata = {
    ...data,
    fecha: new Date().toISOString()
  };

  const ipfs = "ipfs://" + btoa(JSON.stringify(metadata));

  const tx = await contract.registerProperty(ipfs);
  await tx.wait();
}

export async function validateProperty(id) {
  const contract = await getContract();

  const tx = await contract.validateProperty(id);
  await tx.wait();
}