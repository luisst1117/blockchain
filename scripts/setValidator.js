async function main() {
  const CONTRACT_ADDRESS = "0xfe852C0D1AEA7F5fC4947eb59AE1B9Dc264AdCDf";
  const MY_ADDRESS = "0xb0B24E489792b421113E1ffCb2D97DBfB24Ad3d1";

  const PropertyRegistry = await ethers.getContractFactory("PropertyRegistry");
  const contract = PropertyRegistry.attach(CONTRACT_ADDRESS);

  const tx = await contract.setValidator(MY_ADDRESS, true);
  await tx.wait();

  console.log("✅ Dirección autorizada como validador");
}

main().catch(console.error);
