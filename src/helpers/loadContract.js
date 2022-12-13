import Web3 from "web3";
import contractJson from "../artifacts/OpenAuction.json";

const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
const web3 = new Web3(provider);

const abi = contractJson.abi;
const address = "0xaA3834eD6965AEDfc9651BD8A1Ae3FCf5766e9AD";
const contract = new web3.eth.Contract(abi, address);

export default contract;
