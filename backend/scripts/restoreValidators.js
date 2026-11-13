const hre = require("hardhat");

const PREVIOUS = "0xfe852C0D1AEA7F5fC4947eb59AE1B9Dc264AdCDf";
const CURRENT = process.env.REGISTRY_ADDRESS || "0xB0d4E610764B6ebb5f72DD94459026c68eE78C0B";

async function main() {
  const [signer] = await hre.ethers.getSigners();
  const oldRegistry = await hre.ethers.getContractAt("PropertyRegistry", PREVIOUS);
  const nextRegistry = await hre.ethers.getContractAt("PropertyRegistry", CURRENT);

  const state = new Map();
  try {
    const logs = await oldRegistry.queryFilter(oldRegistry.filters.ValidatorUpdated());
    for (const log of logs) {
      state.set(String(log.args.validator).toLowerCase(), Boolean(log.args.allowed));
    }
  } catch {
    // el contrato viejo puede no responder; igual se autoriza al admin
  }

  state.set(signer.address.toLowerCase(), true);

  for (const [address, allowed] of state) {
    if (!allowed) continue;
    const tx = await nextRegistry.setValidator(hre.ethers.getAddress(address), true);
    await tx.wait();
    console.log("Validador habilitado:", address);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
