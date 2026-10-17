import { useState } from "react";
import Header from "./components/Header";
import WalletBar from "./components/WalletBar";
import RegisterForm from "./components/RegisterForm";
import ValidateForm from "./components/ValidateForm";
import TransferForm from "./components/TransferForm";
import ValidatorForm from "./components/ValidatorForm";
import PropertyList from "./components/PropertyList";
import { config } from "./config";
import { useWallet } from "./hooks/useWallet";
import { useRoles } from "./hooks/useRoles";

function App() {
  const { account, connect, disconnect } = useWallet();
  const [tick, setTick] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const { isOwner, isValidator } = useRoles(account, tick);

  const refresh = (id) => {
    if (id) setSelectedId(id);
    setTick((n) => n + 1);
  };

  return (
    <div className="container">
      <Header />
      <p className="contract-line">Contrato: {config.contractAddress}</p>
      <WalletBar
        account={account}
        onConnect={connect}
        onDisconnect={disconnect}
        isOwner={isOwner}
        isValidator={isValidator}
      />

      {account && (
        <>
          <div className="grid">
            <RegisterForm onDone={refresh} />
            <ValidateForm selectedId={selectedId} canValidate={isValidator} onDone={refresh} />
            <TransferForm selectedId={selectedId} onDone={refresh} />
            {isOwner && <ValidatorForm onDone={refresh} />}
          </div>
          <PropertyList version={tick} selectedId={selectedId} onSelect={setSelectedId} />
        </>
      )}
    </div>
  );
}

export default App;
