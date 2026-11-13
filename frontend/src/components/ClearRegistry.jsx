import { useState } from "react";
import { useAction } from "../hooks/useAction";
import { vaciarRegistro } from "../inmuebles";
import { STEP } from "../content/guides";

function ClearRegistry({ onDone }) {
  const [sure, setSure] = useState(false);
  const { busy, msg, setMsg, run } = useAction();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!sure) {
      setMsg("Marca la casilla si de verdad quieres vaciar el registro.");
      return;
    }

    const ok = await run(async (status) => {
      status("Confirma en tu cuenta para retirar todas las fichas…");
      await vaciarRegistro();
      return true;
    });

    if (!ok) return;
    setSure(false);
    setMsg("El registro quedó vacío. Los documentos guardados siguen existiendo.");
    onDone?.();
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <p className="card-kicker">{STEP.clear.kicker}</p>
      <h2>{STEP.clear.title}</h2>
      <p className="hint">{STEP.clear.hint}</p>
      <label className="check-row">
        <input type="checkbox" checked={sure} onChange={(e) => setSure(e.target.checked)} />
        Sí, retirar todas las fichas de este registro
      </label>
      <button type="submit" disabled={busy || !sure}>
        {busy ? "Retirando…" : "Vaciar registro"}
      </button>
      {msg && <p className="msg">{msg}</p>}
    </form>
  );
}

export default ClearRegistry;
