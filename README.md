# Registro de inmuebles (NFT + IPFS)

Cada inmueble es un ERC-721 en `PropertyRegistry`. La ficha (dirección, tipo, área) y, si se adjunta, la escritura se pinnean en IPFS con Pinata. En cadena solo queda el CID.

## Qué hay en el repo

- `contracts/PropertyRegistry.sol` — contrato que usa la DApp
- `contracts/PropertyToken.sol` — prototipo viejo, no lo usa el frontend
- `property-dapp/` — React + Vite + MetaMask
- `property-blockchain/` — primer intento (HTML). La vía actual es `property-dapp`

## Contrato

```shell
npm install
npx hardhat test
npx hardhat run scripts/deploy.js --network sepolia
```

Copia la address a `REGISTRY_ADDRESS` y a `property-dapp/.env` como `VITE_REGISTRY_ADDRESS`.

Para habilitar un validador:

```shell
npx hardhat run scripts/setValidator.js --network sepolia
```

Sepolia pide `SEPOLIA_RPC_URL` y `PRIVATE_KEY` en el `.env` de la raíz.

## DApp

En [Pinata](https://app.pinata.cloud) → **API Keys** → **New Key**:
- activa **Admin**, o marca `pinFileToIPFS` y `pinJSONToIPFS`
- copia el **JWT** (si dejas todos los scopes vacíos, sale `NO_SCOPES_FOUND`)

En `property-dapp/.env`:

```
VITE_PINATA_JWT=...
VITE_REGISTRY_ADDRESS=0x...
```

```shell
cd property-dapp
npm install
npm run dev
```

El `npm run dev` proxifica Pinata (`/pinata`) para no pelearse con CORS. Subir fichas desde `npm run preview` o un host estático no va a funcionar sin un backend.

MetaMask tiene que estar en Sepolia. Si no está la red, la DApp intenta agregarla.

En la lista, un clic carga el ID en Validar / Transferir. El owner del contrato ve el formulario para autorizar validadores.

Ignition (opcional):

```shell
npx hardhat ignition deploy ./ignition/modules/PropertyRegistry.js --network sepolia
```

## Flujo

1. Conectar wallet
2. Registrar → Pinata (JSON + archivo opcional) → `registerProperty(ipfs://cid)`
3. Un validador llama `validateProperty`
4. El dueño transfiere con `transferProperty` (o un `transferFrom`; el struct sigue al NFT)
