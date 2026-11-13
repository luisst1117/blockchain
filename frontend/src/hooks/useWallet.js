import { useEffect, useState } from "react";
import { connectWallet, restoreWallet, watchWallet } from "../chain/wallet";

export function useWallet() {
  const [account, setAccount] = useState("");

  useEffect(() => {
    restoreWallet()
      .then(setAccount)
      .catch(() => {});
    return watchWallet(setAccount);
  }, []);

  async function connect() {
    const address = await connectWallet();
    setAccount(address);
    return address;
  }

  function disconnect() {
    setAccount("");
  }

  return { account, setAccount, connect, disconnect };
}
