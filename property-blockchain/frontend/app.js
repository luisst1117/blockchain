document.addEventListener("DOMContentLoaded", () => {

  const { ethers } = window;

  const CONTRACT_ADDRESS = "0xfe852C0D1AEA7F5fC4947eb59AE1B9Dc264AdCDf";

  const ABI = [
    "function registerProperty(string)",
    "function validateProperty(uint256)",
    "function transferProperty(uint256,address)",
    "function getProperty(uint256) view returns (uint256,address,string,uint8,uint256)",
    "function owner() view returns (address)"
  ];

  let provider, signer, contract, account;

  const show = id => document.getElementById(id).classList.remove("hidden");
  const hide = id => document.getElementById(id).classList.add("hidden");

  // 🔗 CONECTAR METAMASK
  document.getElementById("connect").onclick = async () => {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    account = await signer.getAddress();

    document.getElementById("account").innerText = `Conectado: ${account}`;
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    await checkOwner();
  };

  // 🔐 CONTROL DE PROPIETARIO
  async function checkOwner() {
    const owner = await contract.owner();
    const box = document.getElementById("ownerStatus");

    show("ownerStatus");

    if (owner.toLowerCase() === account.toLowerCase()) {
      box.innerHTML = "✅ Eres el <span class='owner'>PROPIETARIO</span>";
      show("registerSection");
      show("validateSection");
      show("transferSection");
    } else {
      box.innerHTML = "❌ No eres el <span class='not-owner'>propietario</span>";
    }
  }

  // 📦 SUBIR METADATA A IPFS (SIMULADO PARA GRADO)
  async function uploadToIPFS(metadata) {
    // En producción: Pinata / Web3.Storage
    // Para grado: simulamos un CID
    return "ipfs://" + btoa(JSON.stringify(metadata));
  }

  // 🏠 REGISTRAR PROPIEDAD
  document.getElementById("registerBtn").onclick = async () => {
    const direccion = document.getElementById("direccion").value;
    const tipo = document.getElementById("tipo").value;
    const area = document.getElementById("area").value;

    const metadata = {
      direccion,
      tipo,
      area,
      fecha: new Date().toISOString()
    };

    const ipfsHash = await uploadToIPFS(metadata);

    document.getElementById("registerStatus").innerText = "⏳ Registrando...";
    const tx = await contract.registerProperty(ipfsHash);
    await tx.wait();

    document.getElementById("registerStatus").innerText = "✅ Propiedad registrada";
  };

  // ✅ VALIDAR
  document.getElementById("validateBtn").onclick = async () => {
    const id = document.getElementById("validateId").value;
    const tx = await contract.validateProperty(id);
    await tx.wait();

    document.getElementById("validateStatus").innerText = "✅ Propiedad validada";
  };

  // 🔄 TRANSFERIR
  document.getElementById("transferBtn").onclick = async () => {
    try {
      const id = document.getElementById("transferId").value;
      const to = document.getElementById("transferTo").value;

      const tx = await contract.transferProperty(id, to);
      document.getElementById("transferStatus").innerText = "⏳ Transferiendo...";
      await tx.wait();

      document.getElementById("transferStatus").innerText = "✅ Transferencia exitosa";
    } catch (e) {
      document.getElementById("transferStatus").innerText = "❌ Error";
      console.error(e);
    }
  };

  // 📋 LISTAR PROPIEDADES
  document.getElementById("loadProperties").onclick = async () => {
    const container = document.getElementById("properties");
    container.innerHTML = "";

    const maxId = document.getElementById("maxId").value;

    for (let i = 1; i <= maxId; i++) {
      try {
        const p = await contract.getProperty(i);

        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
          <b>ID:</b> ${p[0]}<br>
          <b>Propietario:</b> ${p[1]}<br>
          <b>IPFS:</b> ${p[2]}<br>
          <b>Estado:</b> ${["Registrado","Validado","Transferido"][p[3]]}
        `;
        container.appendChild(div);
      } catch {
        continue;
      }
    }
  };

});
