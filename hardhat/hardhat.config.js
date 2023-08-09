require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
    },
    hmvtest: {
      url: 'https://rpc.sandverse.oasys.games',
      chainId: 20197,
      gasPrice: 0,
      accounts: [
        '0xa267530f49f8280200edf313ee7af6b827f2a8bce2897751d06a843f644967b1'
        // Provide your private key here
        // Remove comment out to use value from secrets.json
        //PRIVATE_KEY
      ],
    },
  },
};