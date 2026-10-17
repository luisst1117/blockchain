export function txMessage(err) {
  if (!err) return "Algo salió mal";

  const nested = err.info?.error?.message || err.error?.message;
  const text = err.reason || err.shortMessage || nested || err.message;
  if (!text) return "Algo salió mal";

  if (text.includes("user rejected") || text.includes("ACTION_REJECTED")) {
    return "Cancelaste la transacción en MetaMask";
  }

  if (text.includes("NO_SCOPES_FOUND")) {
    return "La API key de Pinata no tiene permiso para subir archivos. En app.pinata.cloud → API Keys → New Key, marca Admin (o pinFileToIPFS y pinJSONToIPFS), copia el JWT a property-dapp/.env como VITE_PINATA_JWT y reinicia npm run dev.";
  }

  return text;
}
