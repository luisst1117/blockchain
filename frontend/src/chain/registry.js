import { toIpfsUri } from "../ipfs/cid";
import { checksumAddress, parseTokenId } from "../lib/guards";
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
  const uri = toIpfsUri(cid);
  if (!uri) {
    throw new Error("No se pudo guardar la referencia del documento");
  }
  const registry = await registryWrite();
  const receipt = await waitTx(registry.registerProperty(uri));
  return { cid, id: idFromReceipt(registry, receipt) };
}

export async function validateOnChain(id) {
  const registry = await registryWrite();
  await waitTx(registry.validateProperty(parseTokenId(id)));
}

export async function transferOnChain(id, to) {
  const registry = await registryWrite();
  await waitTx(registry.transferProperty(parseTokenId(id), checksumAddress(to, "cuenta destino")));
}

export async function retireAllOnChain() {
  const registry = await registryWrite();
  await waitTx(registry.retireAll());
}

export async function setValidatorOnChain(address, allowed = true) {
  const registry = await registryWrite();
  await waitTx(registry.setValidator(checksumAddress(address, "cuenta del validador"), allowed));
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

  total = Math.min(Math.max(0, total), 200);

  const rows = [];

  for (let id = 1; id <= total; id++) {
    try {
      rows.push(asRow(await registry.getProperty(id)));
    } catch {
      continue;
    }
  }

  return rows;
}
