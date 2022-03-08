// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Casino.sol";

contract CasinoInterface {
    function payWinnings(address to, uint256 amount) public;
}

/* The CasinoGame contract defines top-level state variables
*  and functions that all casino games must have. More game-specific
*  variables and functions will be defined in subclasses that inherit it.
*/
contract CasinoGame is Ownable {

    // State variables
    CasinoInterface private casinoContract;
    uint256 internal minimumBet;
    uint256 internal maxBet;
    mapping (address => bool) private gameInProgress;

    // Sets the address of the Casino contract
    function setCasinoContractAddress(address _address) external onlyOwner {
        casinoContract = CasinoInterface(_address);
    }
}