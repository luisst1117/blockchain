import { looksLikeLegacyBase64 } from "./cid";
import { fetchIpfsJson, pinFile, pinJSON } from "./pinata";

export async function uploadPropertyRecord(fields, escritura) {
  let escrituraCid = null;

  if (escritura) {
    escrituraCid = await pinFile(escritura);
  }

  const payload = {
    direccion: fields.direccion.trim(),
    tipo: fields.tipo.trim(),
    area: fields.area.trim(),
    escrituraCid,
    fecha: new Date().toISOString(),
  };

  return pinJSON(payload, `inmueble-${payload.direccion || "sin-direccion"}`);
}

export async function loadMetadata(uri) {
  if (!uri) return null;

  if (looksLikeLegacyBase64(uri)) {
    try {
      const cid = uri.replace(/^ipfs:\/\//, "");
      return JSON.parse(atob(cid));
    } catch {
      return { nota: "metadata vieja, no se pudo decodificar" };
    }
  }

  try {
    return await fetchIpfsJson(uri);
  } catch {
    return { nota: "CID guardado, pero el gateway no respondió", uri };
  }
}
