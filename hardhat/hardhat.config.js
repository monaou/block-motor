require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    baseGoerli: {
      url: 'https://goerli.base.org',
      chainId: 84531,
      accounts: [
        process.env.PRIVATE_KEY_1
      ],
    },
  },
};