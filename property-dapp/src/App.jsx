import { useState } from "react";
import Header from "./components/Header";
import WalletCard from "./components/WalletCard";
import RegisterProperty from "./components/RegisterProperty";
import ValidateProperty from "./components/ValidateProperty";

function App() {
  const [account, setAccount] = useState("");

  return (
    <div className="container">
      <Header />

      <WalletCard account={account} setAccount={setAccount} />

      {account && (
        <>
          <RegisterProperty />
          <ValidateProperty />
        </>
      )}
    </div>
  );
}

export default App;