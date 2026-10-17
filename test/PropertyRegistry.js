const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PropertyRegistry", function () {
  async function deploy() {
    const [owner, alice, bob, inspector] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("PropertyRegistry");
    const registry = await factory.deploy();
    return { registry, owner, alice, bob, inspector };
  }

  it("mintea al que registra y deja estado Registrado", async function () {
    const { registry, alice } = await deploy();
    const uri = "ipfs://bafytestcid";

    await registry.connect(alice).registerProperty(uri);

    expect(await registry.totalProperties()).to.equal(1n);
    expect(await registry.ownerOf(1)).to.equal(alice.address);
    expect(await registry.tokenURI(1)).to.equal(uri);

    const item = await registry.getProperty(1);
    expect(item.owner).to.equal(alice.address);
    expect(item.ipfsHash).to.equal(uri);
    expect(item.status).to.equal(0);
  });

  it("rechaza un hash vacío", async function () {
    const { registry, alice } = await deploy();
    await expect(registry.connect(alice).registerProperty("")).to.be.revertedWith(
      "IPFS hash invalido",
    );
  });

  it("solo un validador autorizado puede pasar a Validado", async function () {
    const { registry, owner, alice, inspector } = await deploy();
    await registry.connect(alice).registerProperty("ipfs://cid-1");

    await expect(registry.connect(inspector).validateProperty(1)).to.be.revertedWith(
      "No autorizado para validar",
    );

    await registry.connect(owner).setValidator(inspector.address, true);
    await registry.connect(inspector).validateProperty(1);

    const item = await registry.getProperty(1);
    expect(item.status).to.equal(1);
  });

  it("no deja validar dos veces", async function () {
    const { registry, owner, alice, inspector } = await deploy();
    await registry.connect(alice).registerProperty("ipfs://cid-1");
    await registry.connect(owner).setValidator(inspector.address, true);
    await registry.connect(inspector).validateProperty(1);

    await expect(registry.connect(inspector).validateProperty(1)).to.be.revertedWith(
      "Estado invalido",
    );
  });

  it("transfiere y sincroniza el struct aunque usen transferFrom", async function () {
    const { registry, alice, bob } = await deploy();
    await registry.connect(alice).registerProperty("ipfs://cid-1");

    await registry.connect(alice).transferFrom(alice.address, bob.address, 1);

    expect(await registry.ownerOf(1)).to.equal(bob.address);
    const item = await registry.getProperty(1);
    expect(item.owner).to.equal(bob.address);
    expect(item.status).to.equal(2);
  });

  it("transferProperty solo la dispara el dueño", async function () {
    const { registry, alice, bob } = await deploy();
    await registry.connect(alice).registerProperty("ipfs://cid-1");

    await expect(
      registry.connect(bob).transferProperty(1, bob.address),
    ).to.be.revertedWith("No es el propietario");

    await registry.connect(alice).transferProperty(1, bob.address);
    expect(await registry.ownerOf(1)).to.equal(bob.address);
  });

  it("no transfiere a la misma wallet", async function () {
    const { registry, alice } = await deploy();
    await registry.connect(alice).registerProperty("ipfs://cid-1");
    await expect(
      registry.connect(alice).transferProperty(1, alice.address),
    ).to.be.revertedWith("Destino igual al origen");
  });

  it("emite PropertyTransferred también con transferFrom", async function () {
    const { registry, alice, bob } = await deploy();
    await registry.connect(alice).registerProperty("ipfs://cid-1");

    await expect(registry.connect(alice).transferFrom(alice.address, bob.address, 1))
      .to.emit(registry, "PropertyTransferred")
      .withArgs(1, alice.address, bob.address);
  });

  it("rechaza validador cero", async function () {
    const { registry } = await deploy();
    await expect(registry.setValidator(ethers.ZeroAddress, true)).to.be.revertedWith(
      "Validador invalido",
    );
  });
});
