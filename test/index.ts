import { expect } from "chai";
import { ethers } from "hardhat";

describe("", function () {
  it("", async function () {
    const [addr2] = await ethers.getSigners();
    // Deploy Chip contract
    const fChip = await ethers.getContractFactory("Chip");
    const dChip = await fChip.deploy();
    await dChip.deployed();
    // Deploy Casino contract
    const fCasino = await ethers.getContractFactory("Casino");
    const dCasino = await fCasino.deploy();
    await dCasino.deployed();
    // Deploy Blackjack contract with minbet of 1, maxbet of 500, num decks 4
    const fBlackjack = await ethers.getContractFactory("Blackjack");
    const dBlackjack = await fBlackjack.deploy("1000000000000000000", "5000000000000000000000", 4); // minbet 1 in wei, maxbet 50 in wei
    await dBlackjack.deployed();
    // Set values in Chip contract
    await dChip.setCasinoAddress(dCasino.address);   
    // Set values in Casino contract
    await dCasino.setChipContractAddress(dChip.address);
    await dCasino.addCasinoGameContractAddress(dBlackjack.address);
    // Set values in Blackjack (CasinoGame) contract
    await dBlackjack.setCasinoContractAddress(dCasino.address);
    await dBlackjack.setChipContractAddress(dChip.address);

    // Wallet 2 claims initial tokens
    await dCasino.connect(addr2).claimInitialTokens();
    expect(await dCasino.alreadyClaimedTokens(addr2.address)).to.equal(true);
    expect(await dChip.balanceOf(addr2.address)).to.equal("100000000000000000000"); // 100 in wei

    await dChip.connect(addr2).approve(dCasino.address, "5000000000000000000"); // 5 in wei
    await dBlackjack.connect(addr2).playRound("5000000000000000000"); // 5 in wei

    // Check that user lost 5 CHIPs and Casino got 5 CHIPS
    expect(await dChip.balanceOf(addr2.address)).to.equal("95000000000000000000"); // 95 in wei
    expect(await dChip.balanceOf(dCasino.address)).to.equal("5000000000000000000"); // 5 in wei

    console.log(await dBlackjack.getHand(addr2.address).then((hand: any) => {return hand;}));

    // Hit initial card
    await dBlackjack.connect(addr2).hitPlayer(addr2.address, 0);
    console.log(await dBlackjack.getHand(addr2.address).then((hand: any) => {return hand;}));
  });
});