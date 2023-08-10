const { ethers } = require("hardhat");
const fs = require('fs');

async function main() {
  const FIXED_GAS_PRICE = ethers.utils.parseUnits("20", "gwei");

  const ContractFactory = await ethers.getContractFactory("Web3Mint");
  const contract = await ContractFactory.deploy({ gasPrice: FIXED_GAS_PRICE });

  console.log("Dino Runner contract deployed to:", contract.address);

  // アドレスをオブジェクトとして作成
  const addressObject = {
    contractAddress: contract.address
  };

  // JSON形式でオブジェクトを文字列に変換
  const jsonData = JSON.stringify(addressObject, null, 2);

  // JSONデータをファイルに書き込む
  fs.writeFileSync('contractAddress.json', jsonData);

  console.log("Dino Runner address saved to: contractAddress.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
