import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xfe852C0D1AEA7F5fC4947eb59AE1B9Dc264AdCDf";

const ABI = [
  "function registerProperty(string)",
  "function validateProperty(uint256)",
  "function transferProperty(uint256,address)",
  "function getProperty(uint256) view returns (uint256,address,string,uint8,uint256)",
  "function owner() view returns (address)"
];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);

  const [direccion, setDireccion] = useState("");
  const [tipo, setTipo] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("");

  const [validateId, setValidateId] = useState("");
  const [validateStatus, setValidateStatus] = useState("");

  const [transferId, setTransferId] = useState("");
  const [transferTo, setTransferTo] = useState("");
  const [transferStatus, setTransferStatus] = useState("");

  const uploadToIPFS = async (metadata) => {
    return "ipfs://" + btoa(JSON.stringify(metadata));
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Instala MetaMask");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ABI,
      signer
    );

    setAccount(address);
    setContract(contract);
  };

  const registerProperty = async () => {
    try {
      const metadata = { direccion, tipo, area };
      const ipfsHash = await uploadToIPFS(metadata);

      setStatus("Enviando transacción...");
      const tx = await contract.registerProperty(ipfsHash);
      await tx.wait();

      setStatus("Propiedad registrada correctamente");
    } catch {
      setStatus("Error al registrar");
    }
  };

  const validateProperty = async () => {
    try {
      setValidateStatus("Validando...");
      const tx = await contract.validateProperty(validateId);
      await tx.wait();
      setValidateStatus("Propiedad validada");
    } catch {
      setValidateStatus("Error al validar");
    }
  };

  const transferProperty = async () => {
    try {
      setTransferStatus("Transfiriendo...");
      const tx = await contract.transferProperty(transferId, transferTo);
      await tx.wait();
      setTransferStatus("Transferencia completada");
    } catch {
      setTransferStatus("Error en transferencia");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>🏠 Property Registry Blockchain</h1>
        {!account ? (
          <button style={styles.primaryBtn} onClick={connectWallet}>
            Conectar MetaMask
          </button>
        ) : (
          <span style={styles.account}>{account}</span>
        )}
      </header>

      {account && (
        <div style={styles.grid}>
          
          <div style={styles.card}>
            <h2>Registrar Propiedad</h2>
            <input style={styles.input} placeholder="Dirección"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
            />
            <input style={styles.input} placeholder="Tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            />
            <input style={styles.input} placeholder="Área"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
            <button style={styles.primaryBtn} onClick={registerProperty}>
              Registrar
            </button>
            <p>{status}</p>
          </div>

          <div style={styles.card}>
            <h2>Validar Propiedad</h2>
            <input style={styles.input} placeholder="ID"
              value={validateId}
              onChange={(e) => setValidateId(e.target.value)}
            />
            <button style={styles.secondaryBtn} onClick={validateProperty}>
              Validar
            </button>
            <p>{validateStatus}</p>
          </div>

          <div style={styles.card}>
            <h2>Transferir Propiedad</h2>
            <input style={styles.input} placeholder="ID"
              value={transferId}
              onChange={(e) => setTransferId(e.target.value)}
            />
            <input style={styles.input} placeholder="Dirección destino"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
            />
            <button style={styles.warningBtn} onClick={transferProperty}>
              Transferir
            </button>
            <p>{transferStatus}</p>
          </div>

        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "Segoe UI",
    background: "#f5f7fb",
    minHeight: "100vh"
  },
  header: {
    background: "#0f172a",
    color: "white",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    padding: "30px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd"
  },
  primaryBtn: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  secondaryBtn: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  warningBtn: {
    marginTop: "15px",
    padding: "10px",
    width: "100%",
    background: "#ea580c",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer"
  },
  account: {
    fontSize: "12px",
    background: "#1e293b",
    padding: "8px 12px",
    borderRadius: "8px"
  }
};

export default App;