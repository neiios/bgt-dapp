require("dotenv").config();
const { MNEMONIC, PROJECT_ID } = process.env;

const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  contracts_build_directory: "./src/artifacts",
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    goerli: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          `https://goerli.infura.io/v3/${PROJECT_ID}`
        ),
      network_id: 5,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  mocha: {},
  compilers: {
    solc: {
      version: "0.8.17",
    },
  },
};
