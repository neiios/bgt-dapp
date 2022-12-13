import contractJson from "../artifacts/OpenAuction.json";
const abi = contractJson.abi;
const address = "0xaA3834eD6965AEDfc9651BD8A1Ae3FCf5766e9AD";

export default function createContract(web3) {
  return new web3.eth.Contract(abi, address);
}
