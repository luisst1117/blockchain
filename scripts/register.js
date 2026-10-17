const hre = require("hardhat");

async function main() {
  const registryAddress = process.env.REGISTRY_ADDRESS;
  const cid = process.env.IPFS_CID;

  if (!registryAddress || !cid) {
    throw new Error("Define REGISTRY_ADDRESS e IPFS_CID en el .env");
  }

  const uri = cid.startsWith("ipfs://") ? cid : `ipfs://${cid}`;
  const registry = await hre.ethers.getContractAt("PropertyRegistry", registryAddress);
  const tx = await registry.registerProperty(uri);
  await tx.wait();

  console.log("Registrada con URI:", uri);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
