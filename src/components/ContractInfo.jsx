import { useEffect, useState } from "react";
import Web3 from "web3";
import contract from "../helpers/loadContract";
import InfoContainer from "./InfoContainer";
import { convertUnixTime } from "../helpers/helpers";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ContractInfo() {
  // contract information
  const [error, setError] = useState("");
  const [metamaskConnected, setMetamaskConnected] = useState(false);

  const [beneficiary, setBeneficiary] = useState("");
  const [auctionStartDate, setAuctionStartDate] = useState("");
  const [auctionEndDate, setAuctionEndDate] = useState("");
  const [auctionEnded, setAuctionEnded] = useState(false);

  const [highestBidder, setHighestBidder] = useState("");
  const [highestBid, setHighestBid] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [userBalance, setUserBalance] = useState("");

  // web3 instance
  let web3;

  async function connectWalletHandler() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        web3 = new Web3(window.ethereum);
        setError("");
        setMetamaskConnected(true);
        setUserBalance(
          await web3.utils.fromWei(
            await web3.eth.getBalance(
              "0x7f5BBD37Ba943F14E237405308F564e965aAaCe0"
            )
          )
        );
      } catch (err) {
        setError(err.message);
      }
    } else {
      // metamask not installed
      alert("Please install MetaMask!");
    }
  }

  useEffect(() => {
    getContractInfo();
  }, []);

  async function getContractInfo() {
    const title = await contract.methods.title().call();
    setTitle(title);
    const description = await contract.methods.description().call();
    setDescription(description);
    const imageUrl = await contract.methods.url().call();
    setImageUrl(imageUrl);

    const highestBid = await contract.methods.highestBid().call();
    setHighestBid(highestBid);
    const highestBidder = await contract.methods.highestBidder().call();
    setHighestBidder(
      highestBidder.replace(highestBidder.substring(6, 34), " ... ")
    );

    const beneficiary = await contract.methods.beneficiary().call();
    setBeneficiary(beneficiary.replace(beneficiary.substring(6, 34), " ... "));
    const auctionStartDate = await contract.methods.blockTimestamp().call();
    setAuctionStartDate(convertUnixTime(auctionStartDate));
    const auctionEndDate = await contract.methods.auctionEndTime().call();
    setAuctionEndDate(convertUnixTime(auctionEndDate));
    const auctionEnded = await contract.methods.ended().call();
    setAuctionEnded(auctionEnded);
  }

  return (
    <div className="mx-auto my-8 flex max-w-7xl flex-col items-center justify-center gap-8 rounded border px-16 py-8 text-center shadow">
      <h1 className="text-4xl font-bold">Auction Info</h1>

      <div className="auction-info grid gap-4 md:grid-cols-2">
        <div className="left-half flex flex-col gap-8">
          <img
            src={imageUrl}
            alt="Image from a contract."
            className="rounded border shadow-md"
          />
          {metamaskConnected ? (
            <InfoContainer
              heading={"Your balance:"}
              value={userBalance + " Eth."}
            />
          ) : null}

          <div className="interaction flex max-h-20 justify-center gap-8">
            <input
              type="text"
              placeholder="Enter your bid in Eth."
              className="rounded border px-2 shadow-md"
            />
            <button
              onClick={connectWalletHandler}
              className="top-4 right-4 w-fit rounded border py-2 px-4 font-bold shadow hover:bg-neutral-200"
            >
              Place a bid
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded border p-4 shadow">
          <InfoContainer heading={"Title:"} value={title} />
          <InfoContainer heading={"Beneficiary:"} value={beneficiary} />
          <InfoContainer
            heading={"Auction started on:"}
            value={auctionStartDate}
          />
          <InfoContainer heading={"Auction ends on:"} value={auctionEndDate} />
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
          <div className="mt-4 flex flex-col gap-4">
            <h2 className="font-bold">Description:</h2>
            <p>{description}</p>
          </div>
        </div>
      </div>

      <div className="metamask-button-container">
        <div className="error-message-container">
          <p>{error}</p>
        </div>
        <button
          onClick={connectWalletHandler}
          className="top-4 right-4 w-fit rounded border py-2 px-4 font-bold shadow hover:bg-neutral-200"
        >
          Connect to MetaMask
        </button>
        <p>
          Connection status: {metamaskConnected ? "Connected" : "Not Connected"}
        </p>
      </div>
    </div>
  );
}
