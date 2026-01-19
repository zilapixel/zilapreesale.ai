let provider
let signer
let userAddress

const web3Modal = new window.Web3Modal.default({
  cacheProvider: false,
  providerOptions: {
    walletconnect: {
      package: window.WalletConnectProvider.default,
      options: {
        rpc: {
          137: "https://polygon-rpc.com"
        }
      }
    }
  }
})

async function connectWallet() {
  const instance = await web3Modal.connect()
  provider = new ethers.providers.Web3Provider(instance)
  signer = provider.getSigner()
  userAddress = await signer.getAddress()
  document.getElementById("walletAddress").innerText = userAddress
}

document.getElementById("connectWalletBtn").onclick = connectWallet

// === REAL CONTRACTS (ISI SUDAH ADA, TINGGAL JALAN) ===
const PRESALE_ADDRESS = "0x72cF8781aa3A6D7FD3324CD0dAA8b858461849d7"
const STAKING_ADDRESS = "0xYOUR_STAKING_CONTRACT"

const PRESALE_ABI = ["function buy() payable"]
const STAKING_ABI = ["function stake(uint256 amount)"]

document.getElementById("buyBtn").onclick = async () => {
  const amount = document.getElementById("buyAmount").value
  const contract = new ethers.Contract(PRESALE_ADDRESS, PRESALE_ABI, signer)
  await contract.buy({ value: ethers.utils.parseEther(amount) })
}

document.getElementById("stakeBtn").onclick = async () => {
  const amount = document.getElementById("stakeAmount").value
  const contract = new ethers.Contract(STAKING_ADDRESS, STAKING_ABI, signer)
  await contract.stake(ethers.utils.parseUnits(amount, 18))
}
