import { useEffect, useState } from "react";
import { STATUS_LABEL } from "../chain/registry";
import { ipfsGatewayUrl } from "../ipfs/cid";
import { shortAddress } from "../chain/wallet";
import { listarInmuebles } from "../inmuebles";
import { txMessage } from "../lib/errors";

function formatDate(ts) {
  if (!ts) return "";
  try {
    return new Date(ts * 1000).toLocaleString("es-CO");
  } catch {
    return "";
  }
}

function PropertyList({ version, selectedId, onSelect }) {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("Cargando...");

  useEffect(() => {
    let alive = true;
    setMsg("Cargando...");

    listarInmuebles()
      .then((rows) => {
        if (!alive) return;
        setItems(rows);
        setMsg(rows.length ? "" : "Todavía no hay propiedades en este contrato");
      })
      .catch((err) => {
        if (!alive) return;
        setMsg(txMessage(err));
      });

    return () => {
      alive = false;
    };
  }, [version]);

  return (
    <section className="card">
      <h2>Propiedades</h2>
      {msg && <p className="msg">{msg}</p>}

      <div className="list">
        {items.map((item) => {
          const meta = item.metadata || {};
          const docUrl = meta.escrituraCid ? ipfsGatewayUrl(meta.escrituraCid) : "";
          const fichaUrl = ipfsGatewayUrl(item.ipfsHash);
          const active = selectedId === item.id;

          return (
            <article
              key={item.id}
              className={active ? "property selected" : "property"}
              onClick={() => onSelect?.(item.id)}
            >
              <div className="property-top">
                <strong>#{item.id}</strong>
                <span>{STATUS_LABEL[item.status] || item.status}</span>
              </div>
              <p>{meta.direccion || "Sin dirección en metadata"}</p>
              <p className="muted">
                {meta.tipo ? `${meta.tipo} · ` : ""}
                {meta.area ? `${meta.area} m² · ` : ""}
                dueño {shortAddress(item.owner)}
                {item.createdAt ? ` · ${formatDate(item.createdAt)}` : ""}
              </p>
              <p className="links">
                {fichaUrl && (
                  <a href={fichaUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                    Ver ficha IPFS
                  </a>
                )}
                {docUrl && (
                  <a href={docUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                    Escritura
                  </a>
                )}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default PropertyList;
