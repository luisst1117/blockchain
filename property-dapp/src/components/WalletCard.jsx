import { connectWallet } from "../services/blockchain";

function WalletCard({ account, setAccount }) {
  const handleConnect = async () => {
    const address = await connectWallet();
    setAccount(address);
  };

  return (
    <div className="card">
      {!account ? (
        <button onClick={handleConnect}>Conectar MetaMask</button>
      ) : (
        <p>✅ Wallet conectada: {account}</p>
      )}
    </div>
  );
}

export default WalletCard;