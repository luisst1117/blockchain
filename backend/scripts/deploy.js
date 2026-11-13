const hre = require("hardhat");

async function main() {
  const factory = await hre.ethers.getContractFactory("PropertyRegistry");
  const registry = await factory.deploy();
  await registry.waitForDeployment();

  console.log("PropertyRegistry:", await registry.getAddress());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
