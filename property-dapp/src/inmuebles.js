import {
  fetchProperties,
  registerOnChain,
  setValidatorOnChain,
  transferOnChain,
  validateOnChain,
} from "./chain/registry";
import { loadMetadata, uploadPropertyRecord } from "./ipfs/uploader";

export async function registrarInmueble(campos, escritura) {
  const cid = await uploadPropertyRecord(campos, escritura);
  return registerOnChain(cid);
}

export async function validarInmueble(id) {
  return validateOnChain(id);
}

export async function transferirInmueble(id, destino) {
  return transferOnChain(id, destino);
}

export async function autorizarValidador(address) {
  return setValidatorOnChain(address, true);
}

export async function listarInmuebles() {
  const rows = await fetchProperties();
  return Promise.all(
    rows.map(async (row) => ({
      ...row,
      metadata: await loadMetadata(row.ipfsHash),
    })),
  );
}
