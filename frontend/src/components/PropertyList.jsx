import { useEffect, useState } from "react";
import { STATUS_TONE } from "../catalogo";
import { STATUS_LABEL } from "../chain/registry";
import { sameAddress, shortAddress } from "../chain/wallet";
import { ipfsGatewayUrl } from "../ipfs/cid";
import { listarInmuebles } from "../inmuebles";
import { txMessage } from "../lib/errors";
import FichaViewer from "./FichaViewer";

function formatDate(ts) {
  if (!ts) return "";
  try {
    return new Date(ts * 1000).toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function applyFilter(items, filter, account) {
  if (filter === "mine") return items.filter((item) => sameAddress(item.owner, account));
  if (filter === "pending") return items.filter((item) => item.status === 0);
  return items;
}

function PropertyList({
  title = "Propiedades",
  emptyText = "Todavía no hay inmuebles en este registro",
  kicker = "Registro",
  lead = "",
  filter = "all",
  account,
  version,
  selectedId,
  onSelect,
}) {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("Cargando el registro…");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setMsg("Cargando el registro…");

    listarInmuebles()
      .then((rows) => {
        if (!alive) return;
        const visible = applyFilter(rows, filter, account);
        setItems(visible);
        setMsg(visible.length ? "" : emptyText);
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setMsg(txMessage(err));
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [version, filter, account, emptyText]);

  return (
    <section className="card card-list">
      <div className="list-head">
        <div>
          <p className="card-kicker">{kicker}</p>
          <h2>{title}</h2>
        </div>
        <span className="count">{loading ? "…" : items.length}</span>
      </div>
      {lead && <p className="hint">{lead}</p>}
      {msg && <p className="msg empty">{msg}</p>}

      <div className="list">
        {items.map((item) => {
          const meta = item.metadata || {};
          const docUrl = meta.escrituraCid ? ipfsGatewayUrl(meta.escrituraCid) : "";
          const tone = STATUS_TONE[item.status] || "registrado";
          const active = selectedId === item.id;

          return (
            <article
              key={item.id}
              className={active ? "property selected" : "property"}
              onClick={onSelect ? () => onSelect(item.id) : undefined}
              style={onSelect ? undefined : { cursor: "default" }}
            >
              <div className="property-top">
                <strong>#{item.id}</strong>
                <span className={`badge badge-${tone}`}>{STATUS_LABEL[item.status] || item.status}</span>
              </div>
              <p className="property-title">{meta.direccion || "Ficha sin datos del predio"}</p>
              <p className="muted">
                {meta.tipo ? `${meta.tipo} · ` : ""}
                {meta.area ? `${meta.area} m² · ` : ""}
                {shortAddress(item.owner)}
                {item.createdAt ? ` · ${formatDate(item.createdAt)}` : ""}
              </p>
              <p className="links">
                <button
                  type="button"
                  className="link-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(item);
                  }}
                >
                  Ver ficha
                </button>
                {docUrl && (
                  <a href={docUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    Escritura
                  </a>
                )}
              </p>
            </article>
          );
        })}
      </div>
      {open && <FichaViewer item={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

export default PropertyList;
