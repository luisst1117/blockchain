import { config } from "../config";
import { safeCid } from "../lib/guards";

export function toIpfsUri(cid) {
  const clean = safeCid(cid);
  if (!clean) return "";
  return `ipfs://${clean}`;
}

export function cidFromUri(uri) {
  return safeCid(uri);
}

export function looksLikeLegacyBase64(uri) {
  const raw = String(uri || "").replace(/^ipfs:\/\//, "");
  return raw.startsWith("eyJ");
}

export function ipfsGatewayUrl(uri) {
  const cid = cidFromUri(uri);
  if (!cid) return "";
  return `${config.ipfsGateway}${cid}`;
}
