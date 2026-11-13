# InmoLedger

Frontend y backend van por separado.

```
backend/     contratos Solidity, Hardhat, tests, deploy
frontend/    React + Vite + MetaMask
```

El backend es la cadena (contrato + scripts). El frontend no comparte `node_modules` ni `.env` con el backend.

## Backend

```shell
cd backend
npm install
npx hardhat test
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat run scripts/setValidator.js --network sepolia
```

Variables en `backend/.env`:

```
SEPOLIA_RPC_URL=
PRIVATE_KEY=
REGISTRY_ADDRESS=
VALIDATOR_ADDRESS=
```

## Frontend

Copia la address del contrato a `frontend/.env` como `VITE_REGISTRY_ADDRESS`. JWT de Pinata: Admin o `pinFileToIPFS` + `pinJSONToIPFS`.

```
VITE_PINATA_JWT=...
VITE_REGISTRY_ADDRESS=0x...
VITE_CHAIN_ID=11155111
```

```shell
cd frontend
npm install
npm run dev
```

## Publicar en Netlify

Solo se sube `frontend/`. El contrato no se despliega ahí: sigue en Sepolia.

1. Sube el repo a GitHub (si aún no está).
2. En [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**.
3. Elige el repositorio. Netlify debe leer `netlify.toml`:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. En **Site settings → Environment variables** agrega (antes del primer build):

```
VITE_PINATA_JWT=tu_jwt_de_pinata
VITE_REGISTRY_ADDRESS=0x...tu_contrato
VITE_CHAIN_ID=11155111
VITE_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

Las variables `VITE_` se meten en el JS en el **build**. Si las cambias, hay que **Redeploy**.

No subas `PRIVATE_KEY` ni el RPC de Hardhat a Netlify.

Sin Git: `cd frontend && npm run build` y arrastra la carpeta `frontend/dist` a [https://app.netlify.com/drop](https://app.netlify.com/drop). En ese modo las env de `.env` local ya van compiladas; no las pongas en un zip público.

MetaMask en Sepolia.

Roles (la vista sale de la wallet, no se elige a mano si no te corresponde):

- **Owner** — cualquier wallet conectada: registrar y transferir *sus* inmuebles
- **Validador** — `validators[address]` en el contrato: ver pendientes y validar
- **Administrador** — `owner()` del contrato: dar/quitar validadores y ver el registro entero

Si una wallet tiene más de un rol, aparecen pestañas.

## Flujo

1. Conectar wallet
2. Registrar → Pinata → contrato
3. Validar (wallet autorizada)
4. Transferir
