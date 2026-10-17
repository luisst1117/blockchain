import { useState } from "react";
import { useAction } from "../hooks/useAction";
import { autorizarValidador } from "../inmuebles";

function ValidatorForm({ onDone }) {
  const [address, setAddress] = useState("");
  const { busy, msg, setMsg, run } = useAction();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!address) {
      setMsg("Pega la wallet del validador");
      return;
    }

    const ok = await run(async () => {
      await autorizarValidador(address);
      return true;
    });

    if (!ok) return;
    setMsg("Validador habilitado");
    setAddress("");
    onDone?.();
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Autorizar validador</h2>
      <p className="hint">Solo el owner del contrato puede hacer esto.</p>
      <input placeholder="0x..." value={address} onChange={(e) => setAddress(e.target.value)} />
      <button type="submit" disabled={busy}>
        {busy ? "Firmando..." : "Dar permiso"}
      </button>
      {msg && <p className="msg">{msg}</p>}
    </form>
  );
}

export default ValidatorForm;
