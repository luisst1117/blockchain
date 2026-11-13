import { useEffect, useState } from "react";
import { STATUS_TONE } from "../catalogo";
import { loadPropertyPicture } from "../chain/history";
import { STATUS_LABEL } from "../chain/registry";
import { shortAddress } from "../chain/wallet";
import { cidFromUri, ipfsGatewayUrl } from "../ipfs/cid";
import { STEP } from "../content/guides";
import ChainGraph from "./ChainGraph";

function formatMetaDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function kindFromType(type) {
  if (type.startsWith("image/")) return "image";
  if (type.includes("pdf")) return "pdf";
  return "file";
}

function sniffBlob(blob, type) {
  const hinted = kindFromType(type);
  if (hinted !== "file") return Promise.resolve(hinted);
  return blob.slice(0, 8).arrayBuffer().then((buf) => {
    const bytes = new Uint8Array(buf);
    const head = new TextDecoder().decode(bytes);
    if (head.startsWith("%PDF")) return "pdf";
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image";
    if (bytes[0] === 0x89 && head.includes("PNG")) return "image";
    return "file";
  });
}

function EscrituraPreview({ url }) {
  const [view, setView] = useState({ status: "loading", src: "", kind: "" });

  useEffect(() => {
    if (!url) return undefined;
    let alive = true;
    const created = [];

    setView({ status: "loading", src: "", kind: "" });

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("gateway");
        return res.blob().then((blob) => ({ blob, type: blob.type || res.headers.get("content-type") || "" }));
      })
      .then(async ({ blob, type }) => {
        if (!alive) return;
        const kind = await sniffBlob(blob, type);
        const objectUrl = URL.createObjectURL(blob);
        created.push(objectUrl);
        setView({ status: "ready", src: objectUrl, kind });
      })
      .catch(() => {
        if (alive) setView({ status: "blocked", src: url, kind: "file" });
      });

    return () => {
      alive = false;
      created.forEach((src) => URL.revokeObjectURL(src));
    };
  }, [url]);

  if (!url) {
    return <p className="hint">Esta ficha no tiene escritura guardada.</p>;
  }

  if (view.status === "loading") {
    return <p className="hint">Cargando la escritura…</p>;
  }

  if (view.status === "ready" && view.kind === "image") {
    return (
      <div className="preview-frame">
        <img src={view.src} alt="Escritura" />
      </div>
    );
  }

  if (view.status === "ready" && view.kind === "pdf") {
    return (
      <div className="preview-frame preview-pdf">
        <object data={view.src} type="application/pdf" title="Escritura">
          <p className="preview-fallback">
            El navegador no incrustó el PDF.
            <a href={url} target="_blank" rel="noopener noreferrer">
              Ábrelo en una pestaña
            </a>
          </p>
        </object>
      </div>
    );
  }

  return (
    <div className="preview-fallback-card">
      <p>El navegador no pudo mostrar el archivo aquí.</p>
      <a className="preview-open" href={url} target="_blank" rel="noopener noreferrer">
        Abrir escritura
      </a>
    </div>
  );
}

function FichaViewer({ item, onClose }) {
  const meta = item?.metadata || {};
  const tone = STATUS_TONE[item.status] || "registrado";
  const fichaCid = cidFromUri(item.ipfsHash);
  const docUrl = meta.escrituraCid ? ipfsGatewayUrl(meta.escrituraCid) : "";
  const fichaUrl = ipfsGatewayUrl(item.ipfsHash);
  const [copied, setCopied] = useState("");
  const [chain, setChain] = useState(null);
  const [chainMsg, setChainMsg] = useState("Leyendo el historial de esta ficha…");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!item) return;
    let alive = true;
    setChain(null);
        setChainMsg("Leyendo el historial de esta ficha…");
    loadPropertyPicture(item)
      .then((picture) => {
        if (!alive) return;
        setChain(picture);
        setChainMsg(picture.events.length ? "" : "Esta ficha aún no tiene movimientos.");
      })
      .catch(() => {
        if (!alive) return;
        setChainMsg("No se pudo leer el historial de esta ficha.");
      });
    return () => {
      alive = false;
    };
  }, [item]);

  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
    } catch {
      setCopied("");
    }
  };

  if (!item) return null;

  return (
    <div className="ficha-overlay" onClick={onClose} role="presentation">
      <div
        className="ficha-sheet"
        role="dialog"
        aria-labelledby="ficha-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="ficha-top">
          <div>
            <p className="card-kicker">Ficha del predio</p>
            <h2 id="ficha-title">Inmueble #{item.id}</h2>
            <p className="hint">{STEP.ficha}</p>
          </div>
          <span className={`badge badge-${tone}`}>{STATUS_LABEL[item.status]}</span>
        </div>

                <p className="ficha-address">{meta.direccion || "Sin dirección en los datos del predio"}</p>

        <dl className="ficha-grid">
          <div>
            <dt>Tipo</dt>
            <dd>{meta.tipo || "—"}</dd>
          </div>
          <div>
            <dt>Área</dt>
            <dd>{meta.area ? `${meta.area} m²` : "—"}</dd>
          </div>
          <div>
            <dt>Dueño</dt>
            <dd>{shortAddress(item.owner)}</dd>
          </div>
          <div>
            <dt>Registrada</dt>
            <dd>{formatMetaDate(meta.fecha)}</dd>
          </div>
        </dl>

        <div className="cid-row">
          <div>
            <span className="field-label">Código del documento</span>
            <code>{fichaCid || item.ipfsHash}</code>
          </div>
          <button type="button" className="ghost" onClick={() => copy(fichaCid || item.ipfsHash, "ficha")}>
            {copied === "ficha" ? "Copiado" : "Copiar"}
          </button>
        </div>

        <div className="ficha-chain">
          <p className="card-kicker">Historial de esta ficha</p>
          <p className="hint">{STEP.chain}</p>
          {chainMsg && <p className="msg">{chainMsg}</p>}
          {chain && chain.nodes.length > 0 && <ChainGraph picture={chain} compact />}
        </div>

        <div className="escritura-block">
          <div className="list-head">
            <div>
              <p className="card-kicker">Escritura</p>
              <p className="hint">{STEP.escritura}</p>
            </div>
            {docUrl && (
              <a href={docUrl} target="_blank" rel="noopener noreferrer">
                Abrir original
              </a>
            )}
          </div>
          <EscrituraPreview url={docUrl} />
        </div>

        <div className="ficha-actions">
          {fichaUrl && (
            <a className="ghost-link" href={fichaUrl} target="_blank" rel="noopener noreferrer">
              Ver datos originales
            </a>
          )}
          <button type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default FichaViewer;
