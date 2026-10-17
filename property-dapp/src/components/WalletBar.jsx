import { useState } from "react";
import { shortAddress } from "../chain/wallet";
import { txMessage } from "../lib/errors";

function WalletBar({ account, onConnect, onDisconnect, isOwner, isValidator }) {
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
    <div className="card">
      {!account ? (
        <button type="button" onClick={handleConnect}>
          Conectar MetaMask
        </button>
      ) : (
        <div className="wallet-row">
          <p className="wallet-ok">
            {shortAddress(account)}
            {isOwner ? " · owner del contrato" : ""}
            {isValidator ? " · validador" : ""}
          </p>
          <button type="button" className="ghost" onClick={onDisconnect}>
            Salir
          </button>
        </div>
      )}
      {error && <p className="msg error">{error}</p>}
    </div>
  );
}

export default WalletBar;
