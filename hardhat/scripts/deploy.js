const fs = require('fs');

// Type your own PUBLIC key in here

async function main() {
  const ContractFactory = await ethers.getContractFactory("CarNFT");
  const contract = await ContractFactory.deploy();

  await contract.deployed();
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