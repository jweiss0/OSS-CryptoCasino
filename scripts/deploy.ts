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

    //  Deploy  Chip contract
    const fChip = await ethers.getContractFactory("Chip");
    const dChip = await fChip.deploy();
    await dChip.deployed();
    console.log("Chip deployed to:", dChip.address);

    // Deploy Casino contract
    const fCasino = await ethers.getContractFactory("Casino");
    const dCasino = await fCasino.deploy();
    await dCasino.deployed();
    console.log("Casino deployed to:", dCasino.address);

    // Deploy CasinoGame contract
    const fCasinoGame = await ethers.getContractFactory("CasinoGame");
    const dCasinoGame = await fCasinoGame.deploy();
    await dCasinoGame.deployed();
    console.log("CasinoGame deployed to:", dCasinoGame.address);

    // Deploy Blackjack contract
    const fBlackjack = await ethers.getContractFactory("Blackjack");
    const dBlackjack = await fBlackjack.deploy();
    await dBlackjack.deployed();
    console.log("Blackjack deployed to:", dBlackjack.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
