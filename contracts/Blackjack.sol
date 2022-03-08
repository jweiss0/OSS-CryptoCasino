// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "./provableAPI.sol";
import "./CasinoGame.sol";

struct Card {
    string value;
    string suit;
}

struct BlackjackPlayer {
    uint256 totalBet;
    uint16[] cards;
    uint8 handValue;
    bool isBust;
    bool isBlackjack;
}

struct BlackjackGame {
    BlackjackPlayer player;
    BlackjackPlayer dealer;
}

/* The Blackjack contract defines specific state variables
*  and functions for a user to play Blackjack at the Casino.
*/
contract Blackjack is CasinoGame {

    // State variables
    mapping (address => bool) private isPlayingRound;
    mapping (address => BlackjackGame) private bjGames;
    uint16[13] private cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    string[4] private cardSuits = ["Spades", "Clubs", "Hearts", "Diamonds"];

    // Sets the value of isPlayingRound to true or false for a player
    function setIsPlayingRound(address _address, bool _isPlaying) internal {
        isPlayingRound[_address] = _isPlaying;
    }

    // Handles the initial start of a blackjack round. It creates a new BlackjackGame with
    // a new player and dealer. It also sets the isPlayingRound and gameInProgress attributes
    // to true. Lastly, it handles the initial dealing of cards to the player and the dealer.
    function playRound(uint256 _betAmount) public {
        // Only start the round if player is not in the middle of a game or an existing round.
        // Check that the paid bet is large enough.
        require(gameinProgress[msg.sender] == false, "Already playing game.");
        require(isPlayingRound[msg.sender] == false, "Already playing round.");
        require(_betAmount >= minimumBet, "Bet is too small.");

        //  Initialize new game round
        BlackjackPlayer memory player;
        BlackjackDealer memory dealer;
        bjGames[msg.sender] = BlackjackGame(player, dealer);
        setIsPlayingRound(msg.sender, true);
        setGameInProgress(msg.sender, true);

        // Handle initial dealing of cards
        deal(bjGames[msg.sender]);
    }

    // Handles the end of a blackjack round. It sets the isPlayingRound and gameInProgress
    // attributes to false. Then, it resets the BlackjackGame attributes.
    function endRound() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

        setIsPlayingRound(msg.sender, false);
        setGameInProgress(msg.sender, false);
        resetBJGame(bjGames[msg.sender]);
    }

    // Handles the first deal of cards to player and dealer.
    function deal() internal {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");
        BlackjackGame storage game = games[msg.sender];
        dealSingleCard(game, game.player);
        dealSingleCard(game, game.dealer);
        dealSingleCard(game, game.player);
        dealSingleCard(game, game.dealer);
    }

    // Handles splitting cards from a hand.
    function split() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");
    }

    // Handles doubling down on a hand.
    function doubleDown() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

    }

    // Handles dealing another card to the player.
    function hit() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

    }

    // Handles finishing a player's turn.
    function stand() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

    }

    // Handles selecting and dealing a single card to the specified player.
    function dealSingleCard(BlackjackGame storage _game, BlackjackPlayer _player) private {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

        // Use some sort of random function to select a card and suit from the deck
    }

    // Resets a BlackjackGame and all the internal attributes.
    function resetBJGame(BlackjackGame storage _game) internal {
        // Reset player attributes
        _game.player.totalBet = 0;
        _game.player.handValue = 0;
        _game.player.isBust = false;
        _game.player.isBlackjack = false;
        delete _game.player.cards;

        // Reset dealer attributes
        _game.dealer.handValue = 0;
        _game.dealer.isBust = false;
        _game.dealer.isBlackjack = false;
        delete _game.dealer.cards;
    }

    // Returns the value of a card. Returns 0 for Ace. Returns -1 if 
    // _card is uninitialized.
    function getCardValue(Card _card) public view returns (uint16) {
        if(bytes(_card).length > 0) {
            if(isAlphaUpper(_card.value)) {
                if(keccak256(abi.encodePacked((_card.value))) == keccak256(abi.encodePacked(("A"))))
                    return 0;
                else
                    return 10;
            } else {
                uint16 res = safeParseInt(_card.value);
                return res;
            }
        }
        return -1;
    }

    // Returns true if a string contains only uppercase alphabetic characters
    function isAlphaUpper(string memory _str) public view returns (bool) {
        bytes memory b = bytes(_str);

        for(uint i; i< b .length; i++){
            bytes1 char = b[i];

            if(!(char >= 0x41 && char <= 0x5A))
                return false;
        }
        return true;
    }
}