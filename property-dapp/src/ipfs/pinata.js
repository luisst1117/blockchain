import { config } from "../config";
import { cidFromUri } from "./cid";

function jwt() {
  if (!config.pinataJwt) {
    throw new Error("Falta VITE_PINATA_JWT. Copia property-dapp/.env.example a .env");
  }
  return config.pinataJwt;
}

function pinataUrls(path) {
  const direct = `https://api.pinata.cloud${path}`;
  if (import.meta.env.DEV) {
    return [direct, `/pinata${path}`];
  }
  return [direct];
}

async function pinataFetch(path, init) {
  let lastError;

  for (const url of pinataUrls(path)) {
    try {
      const res = await fetch(url, init);
      if (res.status === 502 || res.status === 503) {
        lastError = new Error("Pinata no respondió (gateway). Reintento...");
        continue;
      }
      return res;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("No pude contactar Pinata");
}

function pinataDetail(body, res) {
  if (typeof body.error === "string") return body.error;
  return body.error?.reason || body.error?.details || body.message || res.statusText;
}

async function parsePinata(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`Pinata: ${pinataDetail(body, res)}`);
  }
  if (!body.IpfsHash) {
    throw new Error("Pinata no devolvió CID");
  }
  return body.IpfsHash;
}

export async function pinJSON(content, name) {
  const res = await pinataFetch("/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pinataContent: content,
      pinataMetadata: { name: name || "inmueble" },
    }),
  });

  return parsePinata(res);
}

export async function pinFile(file) {
  const form = new FormData();
  form.append("file", file);
  form.append("pinataMetadata", JSON.stringify({ name: file.name || "escritura" }));

  const res = await pinataFetch("/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt()}`,
    },
    body: form,
  });

  return parsePinata(res);
}

export async function fetchIpfsJson(uri) {
  const cid = cidFromUri(uri);
  const res = await fetch(`${config.ipfsGateway}${cid}`);
  if (!res.ok) {
    throw new Error("No pude leer el JSON en IPFS");
  }
  return res.json();
}
