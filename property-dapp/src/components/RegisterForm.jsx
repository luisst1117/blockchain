import { pinataConfigured } from "../config";
import { useAction } from "../hooks/useAction";
import { registrarInmueble } from "../inmuebles";

function RegisterForm({ onDone }) {
  const { busy, msg, setMsg, run } = useAction();

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const direccion = form.direccion.value.trim();
    const tipo = form.tipo.value.trim();
    const area = form.area.value.trim();
    const escritura = form.escritura.files?.[0] || null;

    if (!direccion || !tipo || !area) {
      setMsg("Completa dirección, tipo y área");
      return;
    }

    const result = await run(async (status) => {
      status("Subiendo a IPFS y esperando la transacción...");
      return registrarInmueble({ direccion, tipo, area }, escritura);
    });

    if (!result) return;

    setMsg(result.id ? `Registrada como #${result.id}. CID ${result.cid}` : `CID ${result.cid}`);
    form.reset();
    onDone?.(result.id);
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>Registrar</h2>
      {!pinataConfigured() && (
        <p className="msg error">Falta VITE_PINATA_JWT en property-dapp/.env (reinicia Vite).</p>
      )}

      <input name="direccion" placeholder="Dirección" />
      <input name="tipo" placeholder="Tipo" />
      <input name="area" placeholder="Área m²" />

      <label className="file-label">
        Escritura (opcional)
        <input name="escritura" type="file" />
      </label>

      <button type="submit" disabled={busy || !pinataConfigured()}>
        {busy ? "Trabajando..." : "Registrar"}
      </button>
      {msg && <p className="msg">{msg}</p>}
    </form>
  );
}

export default RegisterForm;
