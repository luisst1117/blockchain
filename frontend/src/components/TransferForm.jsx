import { useEffect, useState } from "react";
import { useAction } from "../hooks/useAction";
import { transferirInmueble } from "../inmuebles";
import { STEP } from "../content/guides";
import Field from "./Field";

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
      setMsg("Elige un inmueble de la lista y escribe la cuenta que lo recibe");
      return;
    }

    const ok = await run(async (status) => {
      status("Confirma el traspaso en tu cuenta…");
      await transferirInmueble(id, to);
      return true;
    });

    if (!ok) return;
    setMsg("El inmueble cambió de dueño");
    setTo("");
    onDone?.();
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <p className="card-kicker">{STEP.transfer.kicker}</p>
      <h2>{STEP.transfer.title}</h2>
      <p className="hint">{selectedId ? STEP.transfer.ready(selectedId) : STEP.transfer.idle}</p>

      <Field label="Número del inmueble">
        <input value={id} onChange={(e) => setId(e.target.value)} inputMode="numeric" required />
      </Field>
      <Field label="Cuenta que recibe el inmueble" hint="Empieza por 0x…">
        <input value={to} onChange={(e) => setTo(e.target.value)} spellCheck={false} required />
      </Field>

      <button type="submit" disabled={busy}>
        {busy ? "Esperando confirmación…" : "Transferir título"}
      </button>
      {msg && <p className="msg">{msg}</p>}
    </form>
  );
}

export default TransferForm;
