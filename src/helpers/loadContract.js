import contractJson from "../artifacts/OpenAuction.json";

export default function createContract(web3, address) {
  const abi = contractJson.abi;
  return new web3.eth.Contract(abi, address);
}
