const OpenAuction = artifacts.require("OpenAuction");
// 1000 minutes
const AuctionLength = 60000;
const Title = "Giga Watt";
const Description =
  "The Washington state-based Giga Watt mining facility is among the largest in North America.  This super mine exerts a ridicules 30 MW hashrate and incorporates just over 1,700 GPUs.";
const Url =
  "https://coincentral.com/wp-content/uploads/2018/05/16388051_204990046641128_6870174302440485694_n.jpeg";

module.exports = function (deployer, network, accounts) {
  const Beneficiary = accounts[3];
  // deployment steps
  deployer.deploy(
    OpenAuction,
    AuctionLength,
    Beneficiary,
    Title,
    Description,
    Url
  );
};
