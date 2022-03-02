// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "./CasinoGame.sol";

/* The Blackjack contract defines specific state variables
*  and functions for a user to play Blackjack at the Casino.
*/
contract Blackjack is CasinoGame {

    // State variables
    mapping (address => bool) private isPlayingRound;
}