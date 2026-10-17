const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("PropertyRegistryModule", (m) => {
  const registry = m.contract("PropertyRegistry");
  return { registry };
});
