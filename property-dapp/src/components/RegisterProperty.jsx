import { useState } from "react";
import { registerProperty } from "../services/blockchain";

function RegisterProperty() {
  const [direccion, setDireccion] = useState("");
  const [tipo, setTipo] = useState("");
  const [area, setArea] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    try {
      setMsg("Procesando transacción...");

      await registerProperty({
        direccion,
        tipo,
        area,
      });

      setMsg("✅ Propiedad registrada");
    } catch (error) {
      setMsg("❌ Error");
    }
  };

  return (
    <div className="card">
      <h2>Registrar Propiedad</h2>

      <input
        placeholder="Dirección"
        onChange={(e) => setDireccion(e.target.value)}
      />

      <input
        placeholder="Tipo"
        onChange={(e) => setTipo(e.target.value)}
      />

      <input
        placeholder="Área m²"
        onChange={(e) => setArea(e.target.value)}
      />

      <button onClick={handleRegister}>Registrar</button>

      <p>{msg}</p>
    </div>
  );
}

export default RegisterProperty;