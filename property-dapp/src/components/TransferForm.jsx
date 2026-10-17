import { useEffect, useState } from "react";
import { useAction } from "../hooks/useAction";
import { transferirInmueble } from "../inmuebles";

function TransferForm({ selectedId, onDone }) {
  const [id, setId] = useState("");
  const [to, setTo] = useState("");
  const { busy, msg, setMsg, run } = useAction();

  useEffect(() => {
    if (selectedId) setId(String(selectedId));
  }, [selectedId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!id || !to) {
      setMsg("ID y dirección destino");
      return;
    }

    const ok = await run(async (status) => {
      status("Transferiendo NFT...");
      await transferirInmueble(id, to);
      return true;
    });

    if (!ok) return;
    setMsg("Listo, cambió de dueño");
    setTo("");
    onDone?.();
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Transferir</h2>
      <input placeholder="ID de la propiedad" value={id} onChange={(e) => setId(e.target.value)} />
      <input placeholder="Wallet destino" value={to} onChange={(e) => setTo(e.target.value)} />
      <button type="submit" disabled={busy}>
        {busy ? "Esperando..." : "Transferir"}
      </button>
      {msg && <p className="msg">{msg}</p>}
    </form>
  );
}

export default TransferForm;
