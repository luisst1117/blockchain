import { useState } from "react";
import { txMessage } from "../lib/errors";

export function useAction() {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function run(work) {
    setBusy(true);
    try {
      return await work(setMsg);
    } catch (err) {
      setMsg(txMessage(err));
      return undefined;
    } finally {
      setBusy(false);
    }
  }

  return { busy, msg, setMsg, run };
}
