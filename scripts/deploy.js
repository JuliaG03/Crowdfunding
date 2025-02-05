const { ethers } = require("hardhat");
// Deploy the contract
async function main() {
    
    const Crowdfunding = await ethers.getContractFactory("Crowdfunding");

    const crowdfunding = await Crowdfunding.deploy();

    await crowdfunding.waitForDeployment();

    console.log("Crowdfunding contract deployed to:", crowdfunding.target);
}
// We recommend this pattern to be able to use async/await everywhere
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error deploying contract:", error);
        process.exit(1);
    });