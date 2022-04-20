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
    // minbet 1 in wei, maxbet 50 in wei
    dBlackjack = await fBlackjack.deploy(ethers.utils.parseEther("1"), ethers.utils.parseEther("50"), 4);
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

describe("Casino", function () {
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
    // minbet 1 in wei, maxbet 50 in wei
    dBlackjack = await fBlackjack.deploy(ethers.utils.parseEther("1"), ethers.utils.parseEther("50"), 4);
    await dBlackjack.deployed();
    // Set values in Chip contract
    await dChip.setCasinoAddress(dCasino.address);   
    // Set values in Casino contract
    await dCasino.setChipContractAddress(dChip.address);
    await dCasino.addCasinoGameContractAddress(dBlackjack.address);
    // Set values in Blackjack (CasinoGame) contract
    await dBlackjack.setCasinoContractAddress(dCasino.address);
    await dBlackjack.setChipContractAddress(dChip.address);
  });

  it("Should allow user to claim free tokens", async function () {
    const [addr2] = await ethers.getSigners();
    // Wallet 2 claims initial tokens
    await dCasino.connect(addr2).claimInitialTokens();
    expect(await dCasino.alreadyClaimedTokens(addr2.address)).to.equal(true);
    // Should have 100 CHIPs in wei
    expect(await dChip.balanceOf(addr2.address)).to.equal(ethers.utils.parseEther("100"));
    // Only allows w;allet 2 to claim once
    await expect(dCasino.connect(addr2).claimInitialTokens()).to.be.revertedWith("Already claimed free tokens.");
  });
});