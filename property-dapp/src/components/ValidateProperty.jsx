import { useState } from "react";
import { validateProperty } from "../services/blockchain";

function ValidateProperty() {
  const [id, setId] = useState("");
  const [msg, setMsg] = useState("");

  const handleValidate = async () => {
    try {
      setMsg("Validando propiedad...");
      await validateProperty(id);
      setMsg("✅ Propiedad validada");
    } catch {
      setMsg("❌ No autorizado o error");
    }
  };

  return (
    <div className="card">
      <h2>Validar Propiedad</h2>

      <input
        placeholder="ID Propiedad"
        onChange={(e) => setId(e.target.value)}
      />

      <button onClick={handleValidate}>Validar</button>

      <p>{msg}</p>
    </div>
  );
}

export default ValidateProperty;