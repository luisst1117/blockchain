# DApp de registro

React + Vite. Habla con `PropertyRegistry` y Pinata.

```shell
cp .env.example .env
npm install
npm run dev
```

El JWT sale de Pinata → API Keys → New Key. Tiene que ser **Admin** o tener `pinFileToIPFS` y `pinJSONToIPFS`. Si la key no tiene scopes, Pinata responde `NO_SCOPES_FOUND`.

Pega el JWT en `.env` como `VITE_PINATA_JWT` y **reinicia** Vite (las env no se recargan con HMR). El JWT no va en git.
