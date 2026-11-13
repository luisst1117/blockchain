import { ethers } from "ethers";

const MAX_FILE = 12 * 1024 * 1024;
const FILE_OK = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp", "image/jpg"]);
const FILE_EXT = /\.(pdf|png|jpe?g|webp)$/i;

export function checksumAddress(value, label = "cuenta") {
  const raw = String(value || "").trim();
  if (!raw) throw new Error(`Falta la ${label}`);
  try {
    return ethers.getAddress(raw);
  } catch {
    throw new Error(`La ${label} no es válida`);
  }
}

export function parseTokenId(value) {
  const n = Number(String(value || "").trim());
  if (!Number.isInteger(n) || n < 1) {
    throw new Error("El ID del inmueble no es válido");
  }
  return n;
}

export function assertEscritura(file) {
  if (!file) throw new Error("Adjunta la escritura. Sin ese archivo no se puede registrar.");
  if (file.size > MAX_FILE) {
    throw new Error("La escritura no puede pesar más de 12 MB");
  }
  const typeOk = !file.type || FILE_OK.has(file.type);
  const nameOk = FILE_EXT.test(file.name || "");
  if (!typeOk && !nameOk) {
    throw new Error("La escritura debe ser PDF, JPG, PNG o WebP");
  }
  return file;
}

export function safeCid(uri) {
  if (!uri) return "";
  const cid = String(uri)
    .trim()
    .replace(/^ipfs:\/\//, "")
    .replace(/^https?:\/\/[^/]+\/ipfs\//, "")
    .replace(/^\/ipfs\//, "");
  if (!cid || /[/?#\\]/.test(cid) || cid.includes("..")) return "";
  if (!/^[a-zA-Z0-9]+$/.test(cid)) return "";
  return cid;
}
