// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ChipInterface {
    function balanceOf(address account) external view returns (uint256);
    function casinoMint(address to, uint256 amount) external;
    function casinoTransferFrom(address _from, address _to, uint256 _value) external returns (bool success);
}

/* The Casino contract defines top-level Casino-related transactions that occur
*  within the casino. The main purpose for this contract is to provide a way 
*  for users to claim free utility tokens to use for the casino games, almost
*  like a "chip exchange".
*/
contract Casino is Ownable {

    // State variables
    ChipInterface private chipContract;
    address private casinoGameAddress;
    mapping (address => bool) private freeTokensClaimed;

    // Modifier to check if the calling address is the CasinoGame contract address
    modifier onlyCasinoGame {
        require(msg.sender == casinoGameAddress, "Caller must be CasinoGame.");
        _;
    }

    // Sets the address of the Chip utility token contract
    function setChipContractAddress(address _address) external onlyOwner {
        chipContract = ChipInterface(_address);
    }
    
    // Allows a user to claim 100 free utility tokens one time
    function claimInitialTokens() public {
        // Check that the user has not already claimed their free tokens
        require(freeTokensClaimed[msg.sender] == false, "Already claimed free tokens.");
        // Mint the tokens for the user using the Casino contract function
        chipContract.casinoMint(msg.sender, 10);
        // Mark the user's first time chips as claimed
        freeTokensClaimed[msg.sender] = true;
    }

    // Pays a certain amount of winnings to the specified address. If the Casino
    // contract does not have enough Chips, 1000 more are minted for the Casino.
    function payWinnings(address _to, uint256 _amount) external onlyCasinoGame {
        if(chipContract.balanceOf(address(this)) <= _amount) {
            chipContract.casinoMint(address(this), 100);
        }
        chipContract.casinoTransferFrom(address(this), _to, _amount);
    }
}