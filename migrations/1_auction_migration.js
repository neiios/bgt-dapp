const OpenAuction = artifacts.require("OpenAuction");
const AuctionLength = 600;

module.exports = function (deployer, network, accounts) {
  const Beneficiary = accounts[3];
  // deployment steps
  deployer.deploy(OpenAuction, AuctionLength, Beneficiary);
};
