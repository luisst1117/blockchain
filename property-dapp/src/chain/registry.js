import { toIpfsUri } from "../ipfs/cid";
import { registryRead, registryWrite, waitTx } from "./client";

export const STATUS_LABEL = ["Registrado", "Validado", "Transferido"];

function idFromReceipt(contract, receipt) {
  for (const log of receipt.logs || []) {
    try {
      const parsed = contract.interface.parseLog(log);
      if (parsed?.name === "PropertyRegistered") {
        return Number(parsed.args.propertyId);
      }
    } catch {
      continue;
    }
  }
  return null;
}

function asRow(raw) {
  return {
    id: Number(raw.id),
    owner: raw.owner,
    ipfsHash: raw.ipfsHash,
    status: Number(raw.status),
    createdAt: Number(raw.createdAt),
  };
}

export async function registerOnChain(cid) {
  const registry = await registryWrite();
  const receipt = await waitTx(registry.registerProperty(toIpfsUri(cid)));
  return { cid, id: idFromReceipt(registry, receipt) };
}

export async function validateOnChain(id) {
  const registry = await registryWrite();
  await waitTx(registry.validateProperty(id));
}

export async function transferOnChain(id, to) {
  const registry = await registryWrite();
  await waitTx(registry.transferProperty(id, to));
}

export async function setValidatorOnChain(address, allowed = true) {
  const registry = await registryWrite();
  await waitTx(registry.setValidator(address, allowed));
}

export async function getContractOwner() {
  const registry = await registryRead();
  return registry.owner();
}

export async function isValidator(address) {
  const registry = await registryRead();
  return registry.validators(address);
}

export async function fetchProperties() {
  const registry = await registryRead();
  let total;
  try {
    total = Number(await registry.totalProperties());
  } catch {
    total = 40;
  }

  const rows = [];
  let misses = 0;

  for (let id = 1; id <= total; id++) {
    try {
      rows.push(asRow(await registry.getProperty(id)));
      misses = 0;
    } catch {
      misses += 1;
      if (misses >= 3) break;
    }
  }

  return rows;
}
