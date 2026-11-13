import { useMemo, useState } from "react";
import { shortAddress } from "../chain/wallet";

const KIND_LABEL = {
  register: "Registro",
  validate: "Validación",
  transfer: "Transferencia",
};

const COL = {
  wallet: 0,
  property: 1,
  ipfs: 2,
};

function eventCaption(ev) {
  if (ev.kind === "register") return `Registro #${ev.propertyId}`;
  if (ev.kind === "validate") return `Validó #${ev.propertyId}`;
  if (ev.kind === "transfer") return `Traspaso #${ev.propertyId}`;
  return ev.kind;
}

function eventDetail(ev) {
  if (ev.kind === "register") return shortAddress(ev.owner);
  if (ev.kind === "validate") return ev.validator ? shortAddress(ev.validator) : "validador";
  if (ev.kind === "transfer") {
    return `${shortAddress(ev.from)} → ${shortAddress(ev.to)}`;
  }
  return "";
}

function halfWidth(node) {
  if (node.type === "property") return 34;
  if (node.type === "ipfs") return 70;
  return 76;
}

function layout(nodes, width, compact) {
  const groups = { wallet: [], property: [], ipfs: [] };
  for (const node of nodes) {
    (groups[node.type] || groups.wallet).push(node);
  }

  const colX = compact
    ? [112, Math.round(width / 2), width - 112]
    : [110, Math.round(width / 2), width - 120];
  const row = compact ? 92 : 128;
  const top = compact ? 84 : 70;
  const placed = {};
  let maxRows = 1;

  for (const type of Object.keys(groups)) {
    groups[type].forEach((node, i) => {
      placed[node.id] = {
        ...node,
        x: colX[COL[type] ?? 0],
        y: top + i * row,
      };
      maxRows = Math.max(maxRows, i + 1);
    });
  }

  return { placed, height: Math.max(compact ? 248 : 220, top + 48 + maxRows * row) };
}

function curve(a, b) {
  const mx = (a.x + b.x) / 2;
  const bulge = Math.abs(a.y - b.y) > 8 ? (a.y + b.y) / 2 : a.y;
  return `M ${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${bulge}, ${b.x} ${b.y}`;
}

function labelBox(text) {
  const w = Math.max(64, text.length * 8.2 + 20);
  return { w, h: 24, x: -w / 2, y: -12 };
}

function chipPosition(a, b, slot) {
  const left = a.x <= b.x ? a : b;
  const right = a.x <= b.x ? b : a;
  const gapStart = left.x + halfWidth(left) + 8;
  const gapEnd = right.x - halfWidth(right) - 8;
  const x = gapStart < gapEnd ? (gapStart + gapEnd) / 2 : (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const lift = Math.abs(a.y - b.y) < 20 ? -26 : -10;
  return { x, y: midY + lift + slot * 26 };
}

function showChip(edge) {
  return edge.kind === "register" || edge.kind === "validate" || edge.kind === "transfer";
}

function relatedIds(focus, edges) {
  if (!focus) return null;
  const set = new Set([focus]);
  for (const edge of edges) {
    if (edge.from === focus || edge.to === focus) {
      set.add(edge.from);
      set.add(edge.to);
    }
  }
  return set;
}

function ChainGraph({ picture, compact = false }) {
  const [focus, setFocus] = useState(null);
  const width = compact ? 680 : 920;
  const { placed, height } = useMemo(
    () => layout(picture.nodes, width, compact),
    [picture.nodes, width, compact],
  );
  const lit = relatedIds(focus, picture.edges);
  const focusedNode = focus ? placed[focus] : null;
  const focusedEvent =
    picture.events.find((ev, i) => `e:${i}` === focus) ||
    picture.events.find((ev) => focus === `p:${ev.propertyId}`) ||
    null;

  return (
    <div className={compact ? "chain-wrap compact" : "chain-wrap"}>
      <div className="block-strip" aria-label="Cadena de movimientos">
        {picture.events.map((ev, i) => {
          const id = `e:${i}`;
          const active = focus === id || focus === `p:${ev.propertyId}`;
          return (
            <div key={id} className="block-pair">
              {i > 0 && <span className="block-link" aria-hidden="true" />}
              <button
                type="button"
                className={active ? "chain-block on" : "chain-block"}
                onClick={() =>
                  setFocus(focus === `p:${ev.propertyId}` ? null : `p:${ev.propertyId}`)
                }
              >
                <span className="block-index">
                  {ev.inferred ? "registro" : `paso ${i + 1}`}
                </span>
                <strong>{KIND_LABEL[ev.kind]}</strong>
                <span>{compact ? eventDetail(ev) : eventCaption(ev)}</span>
                {!compact && <em>{eventDetail(ev)}</em>}
              </button>
            </div>
          );
        })}
      </div>

      <div className="graph-board">
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Grafo del registro">
          <defs>
            <marker id="chain-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,1 L7,4 L0,7" fill="none" stroke="#c4a574" strokeWidth="1.2" />
            </marker>
          </defs>
          <text x="110" y="22" className="graph-col">Cuentas</text>
          <text x={width / 2} y="22" className="graph-col" textAnchor="middle">
            Inmuebles
          </text>
          <text x={width - 120} y="22" className="graph-col" textAnchor="end">
            Documentos
          </text>
          {picture.edges.map((edge, i) => {
            const a = placed[edge.from];
            const b = placed[edge.to];
            if (!a || !b) return null;
            const dim = lit && !lit.has(edge.from) && !lit.has(edge.to);
            const labeled = picture.edges.filter(
              (other) => showChip(other) && other.from === edge.from && other.to === edge.to,
            );
            const slot = labeled.findIndex((other) => other.label === edge.label);
            const at = chipPosition(a, b, Math.max(0, slot));
            const box = labelBox(edge.label);
            return (
              <g key={`${edge.from}-${edge.to}-${edge.label}-${i}`} className={dim ? "edge dim" : `edge ${edge.kind}`}>
                <path d={curve(a, b)} markerEnd="url(#chain-arrow)" />
                {showChip(edge) && (
                  <g transform={`translate(${at.x}, ${at.y})`}>
                    <rect className="edge-chip" x={box.x} y={box.y} width={box.w} height={box.h} rx="3" />
                    <text className="edge-label" x="0" y="5">
                      {edge.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          {Object.values(placed).map((node) => {
            const dim = lit && !lit.has(node.id);
            const on = focus === node.id;
            return (
              <g
                key={node.id}
                className={`gnode ${node.type}${dim ? " dim" : ""}${on ? " on" : ""}`}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => setFocus(on ? null : node.id)}
              >
                {node.type === "property" ? (
                  <rect x="-34" y="-34" width="68" height="68" rx="4" />
                ) : node.type === "ipfs" ? (
                  <rect x="-70" y="-20" width="140" height="40" rx="20" />
                ) : (
                  <rect x="-76" y="-22" width="152" height="44" rx="4" />
                )}
                <text y={node.type === "property" ? 5 : 5}>{node.label}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="chain-legend">
        <span>
          <i className="swatch wallet" /> Cuenta
        </span>
        <span>
          <i className="swatch property" /> Inmueble
        </span>
        <span>
          <i className="swatch ipfs" /> Documento
        </span>
        <span>
          <i className="swatch register" /> Registró
        </span>
        <span>
          <i className="swatch validate" /> Validó
        </span>
        <span>
          <i className="swatch transfer" /> Traspaso
        </span>
      </div>

      {focusedNode && (
        <p className="chain-focus">
          {focusedNode.type === "wallet" && `Cuenta ${focusedNode.meta.address}`}
          {focusedNode.type === "property" && `Inmueble ${focusedNode.label}`}
          {focusedNode.type === "ipfs" && `Documento ${focusedNode.meta.cid}`}
          {focusedEvent ? ` · ${KIND_LABEL[focusedEvent.kind]}` : ""}
          {focusedEvent?.tx ? (
            <>
              {" "}
              ·{" "}
              <a href={`https://sepolia.etherscan.io/tx/${focusedEvent.tx}`} target="_blank" rel="noopener noreferrer">
                ver constancia
              </a>
            </>
          ) : null}
        </p>
      )}
    </div>
  );
}

export default ChainGraph;
