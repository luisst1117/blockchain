const hre = require("hardhat");

async function main() {
  const PropertyRegistry = await hre.ethers.getContractFactory("PropertyRegistry");

  console.log("🚀 Deploying PropertyRegistry...");

  const propertyRegistry = await PropertyRegistry.deploy();

  await propertyRegistry.waitForDeployment();

  const address = await propertyRegistry.getAddress();

  console.log("✅ PropertyRegistry deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment error:", error);
    process.exit(1);
  });
