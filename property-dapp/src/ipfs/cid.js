import { config } from "../config";

export function toIpfsUri(cid) {
  if (!cid) return "";
  return cid.startsWith("ipfs://") ? cid : `ipfs://${cid}`;
}

export function cidFromUri(uri) {
  if (!uri) return "";
  return uri
    .replace(/^ipfs:\/\//, "")
    .replace(/^https?:\/\/[^/]+\/ipfs\//, "")
    .replace(/^\/ipfs\//, "");
}

export function looksLikeLegacyBase64(uri) {
  const cid = cidFromUri(uri);
  return cid.startsWith("eyJ");
}

export function ipfsGatewayUrl(uri) {
  const cid = cidFromUri(uri);
  if (!cid) return "";
  return `${config.ipfsGateway}${cid}`;
}
