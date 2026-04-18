import pkg from "hardhat";
const { ethers } = pkg;

async function main() {
  const CONTRACT_ADDRESS = "0x5cAFc49DFd5f334595CD5A3DBf6DcD78EF0c4D1E";

  const contract = await ethers.getContractAt(
    "PropertyRegistry",
    CONTRACT_ADDRESS
  );

  // Simulación de hash documental
  const documentHash = ethers.keccak256(
    ethers.toUtf8Bytes("Escritura inmueble Calle 123 - Bogotá")
  );

  console.log("📄 Hash del documento:", documentHash);

  const tx = await contract.registerProperty(documentHash);
  console.log("⏳ Enviando transacción...");

  await tx.wait();

  console.log("✅ Propiedad registrada correctamente");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
