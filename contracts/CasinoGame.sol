// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

/* The CasinoGame contract defines top-level state variables
*  and functions that all casino games must have. More game-specific
*  variables and functions will be defined in subclasses that inherit it.
*/
contract CasinoGame {

    // State variables
    uint256 internal minimumBet;
    uint256 internal totalBet;
    mapping (address => bool) private gameInProgress;
}