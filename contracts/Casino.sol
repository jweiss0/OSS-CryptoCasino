// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Chip.sol";

contract ChipInterface {
    function casinoMint(address to, uint256 amount) public;
}

/* The Casino contract defines top-level Casino-related transactions that occur
*  within the casino. The main purpose for this contract is to provide a way 
*  for users to claim free utility tokens to use for the casino games, almost
*  like a "chip exchange".
*/
contract Casino is Ownable {

    // State variables
    ChipInterface private chipContract;
    mapping (address => bool) internal freeTokensClaimed;

    // Sets the address of the Chip utility token contract
    function setChipContractAddress(address _address) external onlyOwner {
        chipContract = ChipInterface(_address);
    }
    
    // Allows a user to claim 100 free utility tokens one time
    function claimInitialTokens() public {
        // Check that the user has not already claimed their free tokens
        require(freeTokensClaimed[msg.sender] == false, "Already claimed free tokens.");
        // Mint the tokens for the user using the Casino contract function
        chipContract.casinoMint(msg.sender, 10 * 10 ** decimals());
        // Mark the user's first time chips as claimed
        freeTokensClaimed[msg.sender] = true;
    }
}