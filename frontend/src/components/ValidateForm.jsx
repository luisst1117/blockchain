import { useEffect, useState } from "react";
import { useAction } from "../hooks/useAction";
import { validarInmueble } from "../inmuebles";
import { STEP } from "../content/guides";
import Field from "./Field";

function ValidateForm({ selectedId, canValidate, onDone }) {
  const [id, setId] = useState("");
  const { busy, msg, setMsg, run } = useAction();

  useEffect(() => {
    if (selectedId) setId(String(selectedId));
  }, [selectedId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setMsg("Elige un pendiente de la lista");
      return;
    }

    const ok = await run(async (status) => {
      status("Enviando validación…");
      await validarInmueble(id);
      return true;
    });

    if (!ok) return;
    setMsg("Pasó a estado Validado");
    onDone?.();
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <p className="card-kicker">{STEP.validate.kicker}</p>
      <h2>{STEP.validate.title}</h2>
      <p className="hint">{canValidate ? STEP.validate.allowed : STEP.validate.denied}</p>

      <Field label="Número de la ficha">
        <input value={id} onChange={(e) => setId(e.target.value)} inputMode="numeric" required />
      </Field>

      <button type="submit" disabled={busy || !canValidate}>
        {busy ? "Validando…" : "Marcar como validado"}
      </button>
      {msg && <p className="msg">{msg}</p>}
    </form>
  );
}

export default ValidateForm;
