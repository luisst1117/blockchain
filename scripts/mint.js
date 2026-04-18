import hre from "hardhat";

async function main() {
  const { ethers } = hre;

  const contractAddress = "0xd6507aE5d515943e5E418b25eE93efc19C89d309";

  const PropertyToken = await ethers.getContractAt(
    "PropertyToken",
    contractAddress
  );

  const tx = await PropertyToken.mintProperty(
    "0xd6507aE5d515943e5E418b25eE93efc19C89d309",
    "casa 3 pisos calle 29 # 2 -135 popayan cauca",
    250000000,
    {
      gasLimit: 300000,
    }
  );

  console.log("Minting transaction hash:", tx.hash);
  await tx.wait();
  console.log("✅ Propiedad minteada con éxito");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
