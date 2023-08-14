const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const FIXED_GAS_PRICE = ethers.utils.parseUnits("20", "gwei");

  const ContractFactory = await ethers.getContractFactory("Web3Mint");
  const contract = await ContractFactory.deploy({ gasPrice: FIXED_GAS_PRICE });

  console.log("NFT contract deployed to:", contract.address);

  // アドレスをオブジェクトとして作成
  const addressObject = {
    contractAddress: contract.address
  };

  // JSON形式でオブジェクトを文字列に変換
  const addressData = JSON.stringify(addressObject, null, 2);

  const abiObject = {
    _format: "hh-sol-artifact-1",
    contractName: "Web3Mint",
    sourceName: "contracts/Web3Mint.sol",
    abi: ContractFactory.interface.fragments
  };
  const abiData = JSON.stringify(abiObject, null, 2);

  // JSONデータを`shared/contracts`フォルダに書き込む
  const sharedContractsPath = path.join(__dirname, '..', '..', 'src', 'shared_json');

  fs.writeFileSync(path.join(sharedContractsPath, 'contractAddress.json'), addressData);
  fs.writeFileSync(path.join(sharedContractsPath, 'Web3Mint.json'), abiData);

  console.log("NFT address and ABI saved to: src/shared_json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
