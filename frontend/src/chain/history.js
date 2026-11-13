import { cidFromUri } from "../ipfs/cid";
import { shortAddress } from "./wallet";
import { registryRead } from "./client";

const ZERO = "0x0000000000000000000000000000000000000000";

async function queryLogs(registry, event) {
  try {
    return await registry.queryFilter(event, 0, "latest");
  } catch {
    try {
      const latest = await registry.runner.provider.getBlockNumber();
      const from = Math.max(0, latest - 50000);
      return await registry.queryFilter(event, from, "latest");
    } catch {
      return [];
    }
  }
}

function asEvent(kind, log, extra) {
  return {
    kind,
    propertyId: extra.propertyId,
    tx: log.transactionHash,
    block: Number(log.blockNumber),
    logIndex: Number(log.index),
    ...extra,
  };
}

export async function fetchLedger() {
  const registry = await registryRead();
  const [registered, validated, transferred] = await Promise.all([
    queryLogs(registry, "PropertyRegistered"),
    queryLogs(registry, "PropertyValidated"),
    queryLogs(registry, "PropertyTransferred"),
  ]);

  const events = [
    ...registered.map((log) =>
      asEvent("register", log, {
        propertyId: Number(log.args.propertyId),
        owner: log.args.owner,
        ipfsHash: log.args.ipfsHash,
      }),
    ),
    ...validated.map((log) =>
      asEvent("validate", log, {
        propertyId: Number(log.args.propertyId),
        validator: log.args.validator,
      }),
    ),
    ...transferred.map((log) =>
      asEvent("transfer", log, {
        propertyId: Number(log.args.propertyId),
        from: log.args.from,
        to: log.args.to,
      }),
    ),
  ];

  events.sort((a, b) => a.block - b.block || a.logIndex - b.logIndex);
  return events;
}

function snapshotEvents(rows) {
  return rows.map((row, i) => ({
    kind: "register",
    propertyId: row.id,
    owner: row.owner,
    ipfsHash: row.ipfsHash,
    tx: "",
    block: row.createdAt || i,
    logIndex: i,
    inferred: true,
  }));
}

function addNode(map, id, type, label, meta = {}) {
  if (!map.has(id)) map.set(id, { id, type, label, meta });
}

function walletId(addr) {
  return `w:${String(addr).toLowerCase()}`;
}

export function buildPicture(events, rows) {
  const nodes = new Map();
  const edges = [];
  const byId = new Map(rows.map((row) => [row.id, row]));

  const pushEdge = (from, to, label, kind) => {
    if (!from || !to) return;
    edges.push({ from, to, label, kind });
  };

  const ensureProperty = (id) => {
    const key = `p:${id}`;
    const row = byId.get(id);
    addNode(nodes, key, "property", `#${id}`, {
      status: row ? Number(row.status) : null,
      ipfsHash: row?.ipfsHash || "",
    });
    return key;
  };

  const ensureWallet = (addr) => {
    if (!addr || addr === ZERO) return "";
    const key = walletId(addr);
    addNode(nodes, key, "wallet", shortAddress(addr), { address: addr });
    return key;
  };

  const ensureIpfs = (uri, tag) => {
    const cid = cidFromUri(uri);
    if (!cid) return "";
    const key = `i:${cid}`;
    addNode(nodes, key, "ipfs", tag || `${cid.slice(0, 6)}…`, { cid, uri });
    return key;
  };

  for (const row of rows) {
    const property = ensureProperty(row.id);
    const owner = ensureWallet(row.owner);
    const ipfs = ensureIpfs(row.ipfsHash, "Ficha");
    const escritura = ensureIpfs(row.metadata?.escrituraCid, "Escritura");
    pushEdge(owner, property, "titular", "owns");
    pushEdge(property, ipfs, "ficha", "ipfs");
    pushEdge(property, escritura, "escritura", "ipfs");
  }

  for (const ev of events) {
    const property = ensureProperty(ev.propertyId);
    if (ev.kind === "register") {
      pushEdge(ensureWallet(ev.owner), property, "registró", "register");
      pushEdge(property, ensureIpfs(ev.ipfsHash, "Ficha"), "ficha", "ipfs");
    }
    if (ev.kind === "validate") {
      pushEdge(ensureWallet(ev.validator), property, "validó", "validate");
    }
    if (ev.kind === "transfer") {
      pushEdge(ensureWallet(ev.from), property, "cedió", "transfer");
      pushEdge(property, ensureWallet(ev.to), "recibió", "transfer");
    }
  }

  const uniqueEdges = [];
  const seen = new Set();
  for (const edge of edges) {
    const key = `${edge.from}|${edge.to}|${edge.label}`;
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueEdges.push(edge);
  }

  const pairKinds = new Set(uniqueEdges.map((edge) => `${edge.from}|${edge.to}|${edge.kind}`));
  const cleaned = uniqueEdges.filter((edge) => {
    if (edge.kind === "owns" && pairKinds.has(`${edge.from}|${edge.to}|register`)) return false;
    if (edge.label === "IPFS" && pairKinds.has(`${edge.from}|${edge.to}|ipfs`) && edge.kind !== "ipfs") {
      return false;
    }
    return true;
  });

  return {
    nodes: [...nodes.values()],
    edges: cleaned,
    events,
  };
}

export async function loadPropertyPicture(row) {
  const id = Number(row.id);
  let events = [];
  try {
    events = (await fetchLedger()).filter((ev) => Number(ev.propertyId) === id);
  } catch {
    events = [];
  }
  const fromLogs = events.length > 0;
  if (!fromLogs) events = snapshotEvents([row]);
  return {
    fromLogs,
    ...buildPicture(events, [row]),
  };
}
