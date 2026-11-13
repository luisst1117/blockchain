import { useEffect, useState } from "react";
import { getContractOwner, isValidator } from "../chain/registry";
import { sameAddress } from "../chain/wallet";
import { defaultRole, rolesForWallet } from "../roles";

export function useRoles(account, refreshKey) {
  const [contractOwner, setContractOwner] = useState("");
  const [validator, setValidator] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!account) {
      setContractOwner("");
      setValidator(false);
      setReady(true);
      return;
    }

    setContractOwner("");
    setValidator(false);
    setReady(false);

    Promise.all([
      getContractOwner().catch(() => ""),
      isValidator(account).catch(() => false),
    ]).then(([ownerAddr, canValidate]) => {
      setContractOwner(ownerAddr);
      setValidator(Boolean(canValidate));
      setReady(true);
    });
  }, [account, refreshKey]);

  const isAdmin = sameAddress(account, contractOwner);
  const flags = { isAdmin, isValidator: validator, account };
  const available = rolesForWallet(flags);

  return {
    ready,
    isAdmin,
    isValidator: validator,
    isOwner: Boolean(account),
    available,
    fallbackRole: defaultRole(available),
  };
}
