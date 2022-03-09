// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "./CasinoGame.sol";

struct Card {
    string value;
    string suit;
}

struct BlackjackPlayer {
    uint256 totalBet;
    uint16[] cards;
    string[] cardSuits;
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
    string[13] private cardValues = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    string[4] private cardSuits = ["Spades", "Clubs", "Hearts", "Diamonds"];

    // Events (to be emitted)
    event NewRound(address player, uint256 initialBet);
    event PlayerCardsUpdated(address player, uint16[] cardVals, string[] cardSuits);
    event DealerCardsUpdated(address player, uint16[] cardVals, string[] cardSuits);
    event PlayerBetUpdated(address player, uint256 newBet);

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
        require(gameInProgress[msg.sender] == false, "Already playing game.");
        require(isPlayingRound[msg.sender] == false, "Already playing round.");
        require(_betAmount >= minimumBet, "Bet is too small.");

        //  Initialize new game round
        BlackjackPlayer memory player;
        BlackjackPlayer memory dealer;
        bjGames[msg.sender] = BlackjackGame(player, dealer);
        bjGames[msg.sender].player.totalBet = _betAmount;
        setIsPlayingRound(msg.sender, true);
        setGameInProgress(msg.sender, true);

        // Let front end know a new round has begun
        emit NewRound(msg.sender, _betAmount);

        // Handle initial dealing of cards
        deal();
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
        BlackjackGame storage game = bjGames[msg.sender];
        dealSingleCard(game, game.player);
        dealSingleCard(game, game.dealer);
        dealSingleCard(game, game.player);
        dealSingleCard(game, game.dealer);

        // Let front end know the player and dealer hands
        emit PlayerCardsUpdated(msg.sender, game.player.cards, game.player.suits);
        emit DealerCardsUpdated(msg.sender, game.dealer.cards, game.dealer.suits);
    }

    // Handles splitting cards from a hand.
    function split() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

        emit PlayerCardsUpdated(msg.sender, bjGames[msg.sender].cards, bjGames[msg.sender].suits);
    }

    // Handles doubling down on a hand.
    function doubleDown() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

        emit PlayerCardsUpdated(msg.sender, bjGames[msg.sender].cards, bjGames[msg.sender].suits);
    }

    // Handles dealing another card to the player.
    function hit() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

        emit PlayerCardsUpdated(msg.sender, bjGames[msg.sender].cards, bjGames[msg.sender].suits);
    }

    // Handles finishing a player's turn.
    function stand() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");
    }

    // Handles selecting and dealing a single card to the specified player.
    function dealSingleCard(BlackjackGame storage _game, BlackjackPlayer storage _player) private {
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
        delete _game.player.cardSuits;

        // Reset dealer attributes
        _game.dealer.handValue = 0;
        _game.dealer.isBust = false;
        _game.dealer.isBlackjack = false;
        delete _game.dealer.cards;
        delete _game.dealer.cardSuits;
    }

    // Returns the value of a card. Returns 0 for Ace. Returns -1 if 
    // _card is uninitialized.
    function getCardValue(Card memory _card) public view returns (uint16) {
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

    /*
    Copyright (c) 2015-2016 Oraclize SRL
    Copyright (c) 2016-2019 Oraclize LTD
    Copyright (c) 2019-2020 Provable Things Limited
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
    */
    function safeParseInt(string memory _a) internal pure returns (uint _parsedInt) {
        return safeParseInt(_a, 0);
    }

    function safeParseInt(string memory _a, uint _b) internal pure returns (uint _parsedInt) {
        bytes memory bresult = bytes(_a);
        uint mint = 0;
        bool decimals = false;
        for (uint i = 0; i < bresult.length; i++) {
            if ((uint(uint8(bresult[i])) >= 48) && (uint(uint8(bresult[i])) <= 57)) {
                if (decimals) {
                   if (_b == 0) break;
                    else _b--;
                }
                mint *= 10;
                mint += uint(uint8(bresult[i])) - 48;
            } else if (uint(uint8(bresult[i])) == 46) {
                require(!decimals, 'More than one decimal encountered in string!');
                decimals = true;
            } else {
                revert("Non-numeral character encountered in string!");
            }
        }
        if (_b > 0) {
            mint *= 10 ** _b;
        }
        return mint;
    }
}