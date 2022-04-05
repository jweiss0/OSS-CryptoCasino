// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    //  Deploy Chip contract
    const fChip = await ethers.getContractFactory("Chip");
    const dChip = await fChip.deploy();
    await dChip.deployed();
    console.log("Chip deployed to:", dChip.address);

    // Deploy Casino contract
    const fCasino = await ethers.getContractFactory("Casino");
    const dCasino = await fCasino.deploy();
    await dCasino.deployed();
    console.log("Casino deployed to:", dCasino.address);

    // Deploy Blackjack contract
    const fBlackjack = await ethers.getContractFactory("Blackjack");
    const dBlackjack = await fBlackjack.deploy("1000000000000000000", "50000000000000000000", 4); // minbet 1 in wei, maxbet 50 in wei
    await dBlackjack.deployed();
    console.log("Blackjack deployed to:", dBlackjack.address);
    console.log("Set initial min and max bets for Blackjack contract");

    // Set values in Chip contract
    await dChip.setCasinoAddress(dCasino.address);
    console.log("Set initial state values for Chip contract");
    
    // Set values in Casino contract
    await dCasino.setChipContractAddress(dChip.address);
    await dCasino.addCasinoGameContractAddress(dBlackjack.address);
    console.log("Set initial state values for Casino contract");

    // Set values in Blackjack contract
    await dBlackjack.setCasinoContractAddress(dCasino.address);
    await dBlackjack.setChipContractAddress(dChip.address);
    console.log("Set initial state values for Blackjack contract");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
