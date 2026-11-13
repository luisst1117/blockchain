import { useEffect, useState } from "react";
import Header from "./components/Header";
import TopBar from "./components/TopBar";
import Welcome from "./components/Welcome";
import AboutModal from "./components/AboutModal";
import WalletBar from "./components/WalletBar";
import RoleTabs from "./components/RoleTabs";
import OwnerView from "./views/OwnerView";
import ValidatorView from "./views/ValidatorView";
import AdminView from "./views/AdminView";
import { config } from "./config";
import { useWallet } from "./hooks/useWallet";
import { useRoles } from "./hooks/useRoles";
import { ROLE_LABEL, ROLES } from "./roles";
import { shortAddress } from "./chain/wallet";
import { txMessage } from "./lib/errors";

function App() {
  const { account, connect, disconnect } = useWallet();
  const [tick, setTick] = useState(0);
  const [selectedId, setSelectedId] = useState(null);
  const [view, setView] = useState(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const { ready, isAdmin, isValidator, available, fallbackRole } = useRoles(account, tick);

  const refresh = (id) => {
    if (id) setSelectedId(id);
    setTick((n) => n + 1);
  };

  const handleConnect = async () => {
    setConnectError("");
    setConnecting(true);
    try {
      await connect();
    } catch (err) {
      setConnectError(txMessage(err));
    } finally {
      setConnecting(false);
    }
  };

  useEffect(() => {
    if (!account) {
      setView(null);
      setSelectedId(null);
      return;
    }
    if (!ready) return;
    if (!view || !available.includes(view)) {
      setView(fallbackRole);
    }
  }, [account, ready, available, view, fallbackRole]);

  return (
    <div className="shell">
      <TopBar
        account={account}
        roleName={view ? ROLE_LABEL[view] : ""}
        onAbout={() => setAboutOpen(true)}
        onDisconnect={disconnect}
      />
      <div className="container">
        {!account ? (
          <Welcome onConnect={handleConnect} connecting={connecting} error={connectError} />
        ) : (
          <>
            <Header roleKey={view} />
            <p className="contract-chip">Registro {shortAddress(config.contractAddress)}</p>
            <WalletBar account={account} onConnect={connect} roleName={view ? ROLE_LABEL[view] : ""} />

            {!ready && <p className="role-copy">Leyendo tu rol en el registro…</p>}

            {ready && (
              <>
                <RoleTabs available={available} current={view} onChange={setView} />

                {view === ROLES.OWNER && (
                  <OwnerView
                    account={account}
                    version={tick}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onDone={refresh}
                  />
                )}
                {view === ROLES.VALIDATOR && isValidator && (
                  <ValidatorView
                    version={tick}
                    selectedId={selectedId}
                    onSelect={setSelectedId}
                    onDone={refresh}
                  />
                )}
                {view === ROLES.ADMIN && isAdmin && <AdminView version={tick} onDone={refresh} />}
                {view === ROLES.VALIDATOR && !isValidator && (
                  <p className="msg error">Esta cuenta no está autorizada como validador.</p>
                )}
              </>
            )}
          </>
        )}
      </div>
      {aboutOpen && <AboutModal onClose={() => setAboutOpen(false)} />}
    </div>
  );
}

export default App;
