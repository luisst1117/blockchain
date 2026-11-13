export function txMessage(err) {
  if (!err) return "Algo salió mal";

  const nested = err.info?.error?.message || err.error?.message;
  const text = err.reason || err.shortMessage || nested || err.message;
  if (!text) return "Algo salió mal";

  if (text.includes("user rejected") || text.includes("ACTION_REJECTED")) {
    return "Cancelaste la confirmación en tu cuenta";
  }

  if (text.includes("NO_SCOPES_FOUND") || text.includes("Pinata") || text.includes("IPFS")) {
    return "No se pudo guardar o leer el documento. Inténtalo de nuevo.";
  }

  return text;
}
