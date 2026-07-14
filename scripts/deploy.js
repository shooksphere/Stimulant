const hre = require("hardhat");

async function main() {
  console.log("Deploying Stimulant contract...");

  // Get the contract factory
  const Stimulant = await hre.ethers.getContractFactory("Stimulant");

  // Initial supply: 1,000,000 tokens with 18 decimals
  const initialSupply = hre.ethers.parseEther("1000000");

  // Deploy the contract
  const stimulant = await Stimulant.deploy(initialSupply);

  // Wait for deployment to complete
  await stimulant.waitForDeployment();

  const deploymentAddress = await stimulant.getAddress();
  console.log("✅ Stimulant deployed to:", deploymentAddress);

  // Log deployment details
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Initial supply:", hre.ethers.formatEther(initialSupply), "STIM");

  // Get token info
  const tokenInfo = await stimulant.getTokenInfo();
  console.log("\nToken Information:");
  console.log("Name:", tokenInfo[0]);
  console.log("Symbol:", tokenInfo[1]);
  console.log("Decimals:", tokenInfo[2]);
  console.log("Total Supply:", hre.ethers.formatEther(tokenInfo[3]), "STIM");

  // Save deployment address to file
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    address: deploymentAddress,
    deployer: deployer.address,
    initialSupply: hre.ethers.formatEther(initialSupply),
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n✅ Deployment saved to deployment.json");

  // Return the contract address for verification
  return deploymentAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
