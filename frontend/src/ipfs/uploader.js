import { assertEscritura } from "../lib/guards";
import { looksLikeLegacyBase64 } from "./cid";
import { fetchIpfsJson, pinFile, pinJSON } from "./pinata";

export async function uploadPropertyRecord(fields, escritura) {
  const archivo = assertEscritura(escritura);
  const escrituraCid = await pinFile(archivo);

  if (!escrituraCid) {
    throw new Error("No se pudo guardar la escritura");
  }

  const payload = {
    direccion: fields.direccion.trim().slice(0, 160),
    tipo: fields.tipo.trim().slice(0, 40),
    area: String(fields.area).trim().slice(0, 16),
    escrituraCid,
    fecha: new Date().toISOString(),
  };

  const tag = payload.direccion.replace(/[^\w áéíóúñÁÉÍÓÚÑ#-]/gi, "").slice(0, 48);
  return pinJSON(payload, `inmueble-${tag || "ficha"}`);
}

export async function loadMetadata(uri) {
  if (!uri) return null;

  if (looksLikeLegacyBase64(uri)) {
    try {
      const cid = uri.replace(/^ipfs:\/\//, "");
      if (cid.length > 20000) throw new Error("metadata demasiado grande");
      return JSON.parse(atob(cid));
    } catch {
      return { nota: "metadata vieja, no se pudo decodificar" };
    }
  }

  try {
    return await fetchIpfsJson(uri);
  } catch {
    return { nota: "El documento está guardado, pero no se pudo mostrar ahora", uri };
  }
}
