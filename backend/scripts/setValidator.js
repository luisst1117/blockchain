const hre = require("hardhat");

async function main() {
  const registryAddress = process.env.REGISTRY_ADDRESS;
  const validator = process.env.VALIDATOR_ADDRESS;

  if (!registryAddress || !validator) {
    throw new Error("Define REGISTRY_ADDRESS y VALIDATOR_ADDRESS en el .env");
  }

  const registry = await hre.ethers.getContractAt("PropertyRegistry", registryAddress);
  const tx = await registry.setValidator(validator, true);
  await tx.wait();

  console.log("Validador habilitado:", validator);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
