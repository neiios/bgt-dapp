import { useEffect, useState } from "react";
import Web3 from "web3";
import InfoContainer from "./InfoContainer";
import { convertUnixTime } from "../helpers/helpers";

import contractJson from "../artifacts/OpenAuction.json";
import logo from "../public/logo.svg";

// toasts
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ContractInfo() {
  // contract information
  const [metamaskConnected, setMetamaskConnected] = useState(false);
  const [contractAddress, setContractAddress] = useState("");

  const [beneficiary, setBeneficiary] = useState("");
  const [auctionStartDate, setAuctionStartDate] = useState(new Date());
  const [auctionEndDate, setAuctionEndDate] = useState(new Date());
  const [auctionEnded, setAuctionEnded] = useState(false);

  const [highestBidder, setHighestBidder] = useState("");
  const [highestBid, setHighestBid] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [userBalance, setUserBalance] = useState("");

  const [bid, setBid] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [counter, setCounter] = useState(0);

  async function connectWalletHandler() {
    // check if metamask is available
    if (typeof window.ethereum !== "undefined") {
      try {
        // request wallet connection
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let web3Local = new Web3(window.ethereum);
        setWeb3(web3Local);

        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress))
          throw "Contract address is not valid.";

        const c = await new web3.eth.Contract(
          contractJson.abi,
          contractAddress
        );
        // const c = createContract(
        //   web3,
        //   "0x2670e42c079e5BDCb46997A2276C0528F6533924"
        // );
        setContract(c);
      } catch (err) {
        toast.error(err, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } else {
      // metamask not installed
      toast.error("Please install MetaMask!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }

  async function updateThings() {
    async function setBalance() {
      let balanceInWei = await web3.eth.getBalance(account);
      let balance = await web3.utils.fromWei(balanceInWei);
      setUserBalance(parseFloat(balance).toFixed(3));
    }
    if (contract) {
      const title = await contract.methods.title().call();
      const imageUrl = await contract.methods.url().call();
      const description = await contract.methods.description().call();
      const highestBid = await web3.utils.fromWei(
        await contract.methods.highestBid().call()
      );
      const highestBidder = await contract.methods.highestBidder().call();
      const beneficiary = await contract.methods.beneficiary().call();
      const auctionStartDate = await contract.methods.blockTimestamp().call();
      const auctionEndDate = await contract.methods.auctionEndTime().call();
      const auctionEnded = await contract.methods.ended().call();

      setTitle(title);
      setDescription(description);
      setImageUrl(imageUrl);
      setHighestBid(highestBid);
      setHighestBidder(
        highestBidder.replace(highestBidder.substring(6, 34), " ... ")
      );
      setBeneficiary(
        beneficiary.replace(beneficiary.substring(6, 34), " ... ")
      );
      setAuctionStartDate(convertUnixTime(auctionStartDate));
      setAuctionEndDate(convertUnixTime(auctionEndDate));
      setAuctionEnded(auctionEnded);
    }
    if (contract && account) {
      setMetamaskConnected(true);
      setBalance();
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateThings();
      console.log("run use effect");
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    updateThings();
    console.log("run use effect");
  }, [account, contract, counter]);

  async function placeBidHandler() {
    try {
      if (bid <= highestBid) {
        throw "The bid amount is less than current highest bid. Increase your bid.";
      }

      await contract.methods.bid().send({
        from: account,
        value: web3.utils.toWei(bid, "ether"),
      });
      setCounter(counter + 1);
      toast("Bid was sent successfully!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (err) {
      toast.error(err, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }

  async function endAuctionHandler() {
    try {
      if (new Date() < auctionEndDate) {
        throw "Auction is still ongoing. You can't end it now.";
      }
      await contract.methods.auctionEnd().send({
        from: account,
        value: 0,
      });
      setCounter(counter + 1);
      toast("Auction ended!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (err) {
      toast.error(err, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  }

  function updateBid(event) {
    setBid(event.target.value);
  }

  function updateAddress(event) {
    setContractAddress(event.target.value);
  }

  return (
    <div className="mx-auto my-8 flex w-fit max-w-7xl flex-col items-center justify-center gap-8 rounded border px-4 py-8 text-center shadow-xl md:px-16">
      <h1 className="text-4xl font-bold">dAuction</h1>

      {metamaskConnected ? (
        <div className="auction-info grid gap-4 md:grid-cols-2">
          <div className="left-half flex flex-col gap-8 rounded border p-4 shadow">
            <img
              src={imageUrl}
              alt="Image from a contract."
              className="rounded border"
            />
            <InfoContainer
              heading={"Your balance:"}
              value={userBalance + " Eth."}
            />
            <InfoContainer
              heading={"Current highest bid:"}
              value={highestBid + " Eth."}
            />
            <div className="interaction flex flex-wrap justify-center gap-8">
              <input
                type="text"
                placeholder="Enter your bid in Eth."
                className="rounded border px-4 py-2 shadow-md disabled:bg-neutral-200 disabled:opacity-50"
                onChange={updateBid}
                disabled={new Date() > auctionEndDate ? true : false}
              />
              <button
                onClick={placeBidHandler}
                className="w-fit rounded border py-2 px-4 font-bold shadow hover:bg-neutral-200 disabled:bg-neutral-200 disabled:opacity-50"
                disabled={auctionEnded}
              >
                Place a bid
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 rounded border p-4 shadow">
            <div className="info-container flex flex-col gap-4 text-left">
              <InfoContainer heading={"Title:"} value={title} />
              <InfoContainer heading={"Beneficiary:"} value={beneficiary} />
              <InfoContainer
                heading={"Auction started on:"}
                value={auctionStartDate.toISOString()}
              />
              <InfoContainer
                heading={"Auction ends on:"}
                value={auctionEndDate.toISOString()}
              />
              <InfoContainer
                heading={"Auction status:"}
                value={auctionEnded ? "Ended" : "Ongoing"}
              />
              <InfoContainer
                heading={"Current highest bidder:"}
                value={highestBidder}
              />
              <InfoContainer
                heading={"Current highest bid:"}
                value={highestBid + " Eth."}
              />
            </div>
            <div className="flex flex-col gap-4 rounded border p-4 py-8 shadow">
              <h2 className="text-2xl font-bold">Description:</h2>
              <p>{description}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={endAuctionHandler}
                className="w-fit rounded border py-2 px-4 font-bold shadow hover:bg-neutral-200 disabled:bg-neutral-200 disabled:opacity-50"
                disabled={auctionEnded}
              >
                End auction
              </button>
              <button
                onClick={() => window.location.reload(false)}
                className="w-fit rounded border py-2 px-4 font-bold shadow hover:bg-neutral-200 disabled:bg-neutral-200 disabled:opacity-50"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 rounded border p-4 shadow">
            <img src={logo} alt="MetaMask logo." className="w-96" />
          </div>

          <div className="interaction flex flex-wrap justify-center gap-8">
            <input
              type="text"
              placeholder="Enter the contract address"
              className="rounded border px-4 py-2 shadow-md"
              onChange={updateAddress}
            />
          </div>

          <div className="metamask-button-container flex flex-col items-center justify-center gap-4">
            <button
              onClick={connectWalletHandler}
              className="w-fit rounded border py-2 px-4 font-bold shadow hover:bg-neutral-200"
            >
              Connect to MetaMask
            </button>
            <p>
              Connection status:{" "}
              {metamaskConnected ? "Connected" : "Not Connected"}
            </p>
          </div>
        </>
      )}

      <ToastContainer />
    </div>
  );
}
