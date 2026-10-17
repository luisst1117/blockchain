import { useEffect, useState } from "react";
import { getContractOwner, isValidator } from "../chain/registry";
import { sameAddress } from "../chain/wallet";

export function useRoles(account, refreshKey) {
  const [owner, setOwner] = useState("");
  const [validator, setValidator] = useState(false);

  useEffect(() => {
    if (!account) {
      setOwner("");
      setValidator(false);
      return;
    }

    getContractOwner()
      .then(setOwner)
      .catch(() => setOwner(""));

    isValidator(account)
      .then(setValidator)
      .catch(() => setValidator(false));
  }, [account, refreshKey]);

  return {
    isOwner: sameAddress(account, owner),
    isValidator: validator,
  };
}
