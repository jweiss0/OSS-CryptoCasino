// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CasinoGame.sol";

/* Bet types:
    - 0 = Red, Black, Even, Odd, Low, High (Pays even)
    - 1 = Column, Dozen (Pays 2:1)
    - 2 = Line (Pays 5:1)
    - 3 = Corner (Pays 8:1)
    - 4 = Street (Pays 11:1)
    - 5 = Split (Pays 17:1)
    - 6 = Single (Pays 35:1)
*/
struct RoulettePlayer {
    uint8 betType;
    uint256 bet;
    uint8[] betNums;
}

contract Roulette is Ownable, CasinoGame {
    // State variables
    mapping (address => RoulettePlayer) private rGames;
    uint256 private nonce = 0;

    // Events (to be emitted)
    event NewRound(address player, uint256 initialBet);
    event PlayerSpinComplete(address player, uint8 spinNum);
    event RoundResult(address player, uint256 payout);

    // Constructor for initial state values, including calling parent constructor
    constructor(uint256 _minBet, uint256 _maxBet) CasinoGame(_minBet, _maxBet) {}
    
    // Handles the initial start of a roulette round. First pays the initial bet
    //  to the contract, then sets the state of the round in progress to true.
    //  Finishes by calling the spin() function to begin the game.
    function playRound(uint256 _betAmount, uint8 _betType, uint8[] memory _betNums) external {
        // Only start the round if player is not in the middle of a game or an existing round.
        // Check that the paid bet is large enough.
        require(roundInProgress[msg.sender] == false, "Already playing game.");
        require(_betAmount >= minimumBet, "Bet is too small.");
        require(_betAmount <= maximumBet, "Bet is too large.");

        // Place the user's initial bet using a CasinoGame parent function
        payContract(msg.sender, _betAmount);

        //  Initialize new game round
        setRoundInProgress(msg.sender, true);

        // Let front end know a new round has begun
        emit NewRound(msg.sender, _betAmount);

        // Handle initial spin
        spin(msg.sender, _betAmount, _betType, _betNums);
    }

    // Handles creating a new RoulettePlayer to store player attributes.
    //  Selects a random number for the game, emits an event to notify listeners, then ends the game.
    function spin(address _playerAddress, uint256 _bet, uint8 _betType, uint8[] memory _betNums) private {
        require(roundInProgress[_playerAddress] == true, "Not playing round.");
        RoulettePlayer storage player = rGames[_playerAddress];

        player.bet = _bet;
        player.betType = _betType;
        player.betNums = _betNums;

        // Select random number on roulette board
        uint8 rnd = uint8(rand(38));
        if(rnd == 37)
            rnd = 0;

        emit PlayerSpinComplete(_playerAddress, rnd); 
        endRound(_playerAddress, rnd);       
    }

    // Handles the end of a roulette round. It pays winnings, sets the roundInProgress
    // attribute to false. Then, it resets the RoulettePlayer attributes.
    function endRound(address _playerAddress, uint8 spinNum) private {
        require(roundInProgress[_playerAddress] == true, "Not playing round.");

        RoulettePlayer storage player = rGames[_playerAddress];
        uint256 totalPayout = 0;
        bool won = numInArray(spinNum, player.betNums);

        if(won) {
            // Begin by paying back initial bet
            totalPayout += player.bet;
            if(player.betType == 0)
                totalPayout += player.bet; // Pays even
            else if(player.betType == 1)
                totalPayout += player.bet * 2; // Pays 2:1
            else if(player.betType == 2)
                totalPayout += player.bet * 5; // Pays 5:1
            else if(player.betType == 3)
                totalPayout += player.bet * 8; // Pays 8:1
            else if(player.betType == 4)
                totalPayout += player.bet * 11; // Pays 11:1
            else if(player.betType == 5)
                totalPayout += player.bet * 17; // Pays 17;1
            else if(player.betType == 6)
                totalPayout += player.bet * 35; // Pays 35:1
            
            rewardUser(_playerAddress, totalPayout);
        }

        emit RoundResult(_playerAddress, totalPayout);

        setRoundInProgress(_playerAddress, false);
        resetRGame(_playerAddress);
    }

    // Resets a RoulettePlayer and all the internal attributes.
    // Currently not sure if we need to delete the arrays in the structs
    //  before deleting rGames[_playerAddress] to avoid memory leaks?
    function resetRGame(address _playerAddress) private {
        RoulettePlayer storage player = rGames[_playerAddress];
        // Reset attribute
        delete player.betNums;
        // Delete game entry in mapping
        delete rGames[_playerAddress];
    }

    // Returns true if the provided num is in the provided arr, otherwise false.
    function numInArray(uint8 num, uint8[] memory arr) private pure returns(bool) {
        for(uint i = 0; i < arr.length; i++) {
            if(arr[i] == num)
                return true;
        }
        return false;
    }

    // Generates a random number, 0 to _upper (non-inclusive), to be used for card selection.
    // Not truly random, but good enough for the needs of this project.
    // A mainnet application should use something like Chainlink VRF for this task instead.
    function rand(uint256 _upper) public returns(uint256) {
        uint256 seed = uint256(keccak256(abi.encodePacked(
            block.timestamp + block.difficulty +
            ((uint256(keccak256(abi.encodePacked(block.coinbase)))) / (block.timestamp)) +
            block.gaslimit + 
            ((uint256(keccak256(abi.encodePacked(msg.sender)))) / (block.timestamp)) +
            block.number + nonce
        )));

        nonce++;

        return (seed - ((seed / _upper) * _upper));
    }
}