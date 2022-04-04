// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

interface CasinoInterface {
    function payWinnings(address _to, uint256 _amount) external;
    function transferFrom(address _from, uint256 _amount) external;
}

interface ChipInterface {
    function balanceOf(address account) external view returns (uint256);
    function casinoTransferFrom(address _from, address _to, uint256 _value) external;
}

/* The CasinoGame contract defines top-level state variables
*  and functions that all casino games must have. More game-specific
*  variables and functions will be defined in subclasses that inherit it.
*/
abstract contract CasinoGame is Ownable {

    // State variables
    CasinoInterface private casinoContract;
    ChipInterface private chipContract;
    uint256 internal minimumBet;
    uint256 internal maximumBet;
    mapping (address => bool) internal roundInProgress;
    
    // Events (to be emitted)
    event ContractPaid(address player, uint256 amount);
    event RewardPaid(address player, uint256 amount);

    // Constructor for initial state values
    constructor(uint256 _minBet, uint256 _maxBet) {
        minimumBet = _minBet;
        maximumBet = _maxBet;
    }

    // Sets the address of the Casino contract.
    function setCasinoContractAddress(address _address) external onlyOwner {
        casinoContract = CasinoInterface(_address);
    }

    // Sets the address of the Chip contract.
    function setChipContractAddress(address _address) external onlyOwner {
        chipContract = ChipInterface(_address);
    }


    // Sets the minimum bet required for all casino games.
    function setMinimumBet(uint256 _bet) external onlyOwner {
        require(_bet >= 0, "Bet is too low.");
        minimumBet = _bet;
    }
    
    // Sets the maximum bet allowed for all casino games.
    function setMaximumBet(uint256 _bet) external onlyOwner {
        require(_bet >= 0, "Bet is too high.");
        maximumBet = _bet;
    }

     // Sets the value of roundInProgress to true or false for a player.
    function setRoundInProgress(address _address, bool _isPlaying) internal {
        roundInProgress[_address] = _isPlaying;
    }

    // Getters
    function getCasinoContractAddress() public view returns (address) {return address(casinoContract);}
    function getChipContractAddress() public view returns (address) {return address(chipContract);}
    function getMinimumBet() public view returns (uint256) {return minimumBet;}
    function getMaximumBet() public view returns (uint256) {return maximumBet;}

    // Rewards the user for the specified amount if they have won
    // anything from a casino game. Uses the Casino contract's payWinnings
    // function to achieve this.
    function rewardUser(address _user, uint256 _amount) internal {
        require(_amount >= 0, "Not enough to withdraw.");
        casinoContract.payWinnings(_user, _amount);
        emit RewardPaid(_user, _amount);
    }

    // Allows a user to place a bet by paying the contract the specified amount.
    function payContract(address _address, uint256 _amount) internal {
        require(chipContract.balanceOf(_address) >= _amount, "Not enough tokens.");
        casinoContract.transferFrom(_address, _amount);
        emit ContractPaid(_address, _amount);
    }
}