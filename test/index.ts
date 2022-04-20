import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from 'ethers';

describe("Deployment", function () {
  let dChip: Contract;
  let dCasino: Contract;
  let dBlackjack: Contract;

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
    dBlackjack = await fBlackjack.deploy("1000000000000000000", "5000000000000000000000", 4); // minbet 1 in wei, maxbet 50 in wei
    await dBlackjack.deployed();
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
  });
});