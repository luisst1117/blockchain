import { useState } from "react";
import { useAction } from "../hooks/useAction";
import { autorizarValidador } from "../inmuebles";
import { STEP } from "../content/guides";
import Field from "./Field";

function ValidatorForm({ onDone }) {
  const [address, setAddress] = useState("");
  const [allow, setAllow] = useState("grant");
  const { busy, msg, setMsg, run } = useAction();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!address) {
      setMsg("Indica la cuenta del validador");
      return;
    }

    const granting = allow === "grant";
    const ok = await run(async () => {
      await autorizarValidador(address, granting);
      return true;
    });

    if (!ok) return;
    setMsg(granting ? "Validador habilitado" : "Permiso retirado");
    setAddress("");
    onDone?.();
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <p className="card-kicker">{STEP.permissions.kicker}</p>
      <h2>{STEP.permissions.title}</h2>
      <p className="hint">{STEP.permissions.hint}</p>

      <Field label="Cuenta">
        <input
          placeholder="0x…"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          spellCheck={false}
          required
        />
      </Field>

      <Field label="Acción">
        <select value={allow} onChange={(e) => setAllow(e.target.value)}>
          <option value="grant">Dar permiso de validador</option>
          <option value="revoke">Quitar permiso</option>
        </select>
      </Field>

      <button type="submit" disabled={busy}>
        {busy ? "Firmando…" : allow === "grant" ? "Autorizar" : "Revocar"}
      </button>
      {msg && <p className="msg">{msg}</p>}
    </form>
  );
}

export default ValidatorForm;
