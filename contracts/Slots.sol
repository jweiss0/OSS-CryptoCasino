// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "./CasinoGame.sol";

/* The Slots contract defines specific state variables
*  and functions for a user to play Slots at the Casino.
*/
contract Slots is CasinoGame {

    // State variables
    mapping (address => bool) private isPlayingSlots;
}