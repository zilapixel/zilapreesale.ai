let provider, signer, address;
const ADMIN = "0xADMIN_WALLET_ADDRESS".toLowerCase();

async function connectWallet() {
  if (!window.ethereum) return alert("No wallet");
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  address = (await signer.getAddress()).toLowerCase();

  if (address === ADMIN) {
    document.getElementById("adminPanel").classList.remove("hidden");
  }
}
document.getElementById("connectWallet").onclick = connectWallet;

const chatBox = document.getElementById("chatBox");

async function sendMsg() {
  const text = msg.value;
  chatBox.innerHTML += `<div>You: ${text}</div>`;
  await fetch("/chat", {
    method: "POST",
    body: JSON.stringify({ text, address })
  });
}
