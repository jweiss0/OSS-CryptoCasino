import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from 'ethers';

describe("Deployment", function () {
  let dChip: Contract;
  let dCasino: Contract;
  let dBlackjack: Contract;
  let dRoulette: Contract;

  beforeEach(async () => {
    // Deploy Chip contract
    const fChip = await ethers.getContractFactory("Chip");
    dChip = await fChip.deploy();
    await dChip.deployed();
    // Deploy Casino contract
    const fCasino = await ethers.getContractFactory("Casino");
    dCasino = await fCasino.deploy();
    await dCasino.deployed();
    // Deploy Blackjack contract with minbet of 1, maxbet of 500, num decks 4
    const fBlackjack = await ethers.getContractFactory("Blackjack");
    dBlackjack = await fBlackjack.deploy(ethers.utils.parseEther("1"), ethers.utils.parseEther("50"), 4); // minbet 1 in wei, maxbet 50 in wei
    await dBlackjack.deployed();
    // Deploy Roulette contract with minbet of 1, maxbet of 500, num decks 4
    const fRoulette = await ethers.getContractFactory("Roulette");
    dRoulette = await fRoulette.deploy(ethers.utils.parseEther("1"), ethers.utils.parseEther("50")); // minbet 1 in wei, maxbet 50 in wei
    await dRoulette.deployed();
  });

  it("Should successfully set initial contract values", async function () {
    // Set values in Chip contract
    await dChip.setCasinoAddress(dCasino.address);   
    // Set values in Casino contract
    await dCasino.setChipContractAddress(dChip.address);
    await dCasino.addCasinoGameContractAddress(dBlackjack.address);
    // Set values in Blackjack (CasinoGame) contract
    await dBlackjack.setCasinoContractAddress(dCasino.address);
    await dBlackjack.setChipContractAddress(dChip.address);
    // Set values in Roulette (CasinoGame) contract
    await dRoulette.setCasinoContractAddress(dCasino.address);
    await dRoulette.setChipContractAddress(dChip.address);
  });
});