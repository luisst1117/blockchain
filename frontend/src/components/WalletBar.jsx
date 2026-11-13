import { useState } from "react";
import { shortAddress } from "../chain/wallet";
import { txMessage } from "../lib/errors";

function WalletBar({ account, onConnect, roleName }) {
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setError("");
    try {
      await onConnect();
    } catch (err) {
      setError(txMessage(err));
    }
  };

  return (
    <div className="card wallet-card">
      {!account ? (
        <div className="wallet-hero">
          <div>
            <p className="card-kicker">Acceso</p>
            <h2>Conecta tu cuenta</h2>
          </div>
          <ol className="steps">
            <li>Abre tu cuenta en el navegador</li>
            <li>Elige la red de pruebas</li>
            <li>Aprueba la conexión</li>
          </ol>
          <button type="button" onClick={handleConnect}>
            Conectar cuenta
          </button>
        </div>
      ) : (
        <div className="wallet-row">
          <div>
            <p className="card-kicker">Sesión</p>
            <p className="wallet-ok">
              {shortAddress(account)}
              {roleName ? ` · ${roleName}` : ""}
            </p>
          </div>
        </div>
      )}
      {error && <p className="msg error">{error}</p>}
    </div>
  );
}

export default WalletBar;
