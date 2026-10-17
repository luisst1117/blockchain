import { useEffect, useState } from "react";
import { useAction } from "../hooks/useAction";
import { validarInmueble } from "../inmuebles";

function ValidateForm({ selectedId, canValidate, onDone }) {
  const [id, setId] = useState("");
  const { busy, msg, setMsg, run } = useAction();

  useEffect(() => {
    if (selectedId) setId(String(selectedId));
  }, [selectedId]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setMsg("Indica el ID");
      return;
    }

    const ok = await run(async (status) => {
      status("Mandando validación...");
      await validarInmueble(id);
      return true;
    });

    if (!ok) return;
    setMsg("Validada");
    onDone?.();
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Validar</h2>
      <p className="hint">
        {canValidate ? "Esta wallet sí puede validar." : "Esta wallet no está en la lista de validadores."}
      </p>
      <input
        placeholder="ID de la propiedad"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button type="submit" disabled={busy || !canValidate}>
        {busy ? "Validando..." : "Validar"}
      </button>
      {msg && <p className="msg">{msg}</p>}
    </form>
  );
}

export default ValidateForm;
