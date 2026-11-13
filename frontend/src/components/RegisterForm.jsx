import { useState } from "react";
import { TIPOS_INMUEBLE } from "../catalogo";
import { pinataConfigured } from "../config";
import { useAction } from "../hooks/useAction";
import { registrarInmueble } from "../inmuebles";
import { assertEscritura } from "../lib/guards";
import { STEP } from "../content/guides";
import Field from "./Field";

function RegisterForm({ onDone }) {
  const { busy, msg, setMsg, run } = useAction();
  const [escritura, setEscritura] = useState(null);

  const onPickFile = (e) => {
    const file = e.target.files?.[0] || null;
    try {
      if (file) assertEscritura(file);
      setEscritura(file);
      if (file) setMsg("");
    } catch (err) {
      setEscritura(null);
      e.target.value = "";
      setMsg(err.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const direccion = form.direccion.value.trim();
    const tipo = form.tipo.value.trim();
    const area = form.area.value.trim();

    if (!direccion || !tipo || !area) {
      setMsg("Completa dirección, tipo y área");
      return;
    }
    if (Number(area) <= 0) {
      setMsg("El área debe ser mayor que cero");
      return;
    }
    try {
      assertEscritura(escritura);
    } catch (err) {
      setMsg(err.message);
      return;
    }

    const result = await run(async (status) => {
      status("Guardando la escritura…");
      return registrarInmueble({ direccion, tipo, area }, escritura);
    });

    if (!result) return;

    setMsg(result.id ? `Quedó registrada como #${result.id}` : "Registro enviado");
    setEscritura(null);
    form.reset();
    onDone?.(result.id);
  };

  const canSubmit = Boolean(escritura) && pinataConfigured() && !busy;

  return (
    <form className="card" onSubmit={onSubmit} noValidate>
      <p className="card-kicker">{STEP.register.kicker}</p>
      <h2>{STEP.register.title}</h2>
      <p className="hint">{STEP.register.hint}</p>
      {!pinataConfigured() && (
        <p className="msg error">Falta la configuración para guardar documentos. Avisa a quien administra el prototipo.</p>
      )}

      <Field label="Dirección predial" hint="Ej. Calle 5 # 8-21, Popayán" required>
        <input name="direccion" autoComplete="street-address" required />
      </Field>

      <Field label="Tipo de inmueble" required>
        <select name="tipo" defaultValue="" required>
          <option value="" disabled>
            Selecciona un tipo
          </option>
          {TIPOS_INMUEBLE.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Área" hint="Metros cuadrados" required>
        <input name="area" type="number" min="1" step="0.01" required />
      </Field>

      <Field
        label="Escritura"
        hint="PDF, JPG, PNG o WebP. Sin este archivo no se puede registrar."
        required
      >
        <label className={escritura ? "dropzone has-file" : "dropzone dropzone-required"}>
          <input
            name="escritura"
            type="file"
            accept=".pdf,image/jpeg,image/png,image/webp"
            required
            aria-required="true"
            onChange={onPickFile}
          />
          <span>{escritura ? escritura.name : "Adjuntar escritura (obligatorio)"}</span>
        </label>
      </Field>

      <button type="submit" disabled={!canSubmit}>
        {busy ? "Procesando…" : "Registrar y confirmar"}
      </button>
      {!escritura && (
        <p className="field-hint">El botón se activa cuando adjuntas la escritura.</p>
      )}
      {msg && <p className={msg.startsWith("Quedó") || msg === "Registro enviado" ? "msg ok" : "msg"}>{msg}</p>}
    </form>
  );
}

export default RegisterForm;
