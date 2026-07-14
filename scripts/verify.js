const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Verifying Stimulant contract on Etherscan...");

  // Read deployment info
  if (!fs.existsSync("deployment.json")) {
    console.error("deployment.json not found. Please deploy first.");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync("deployment.json", "utf8"));
  const contractAddress = deploymentInfo.address;
  const initialSupply = hre.ethers.parseEther(deploymentInfo.initialSupply);

  console.log("Contract address:", contractAddress);
  console.log("Initial supply:", deploymentInfo.initialSupply, "STIM");

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [initialSupply],
    });
    console.log("✅ Contract verified successfully!");
  } catch (error) {
    console.error("Verification failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
