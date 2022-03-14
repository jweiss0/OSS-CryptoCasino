// SPDX-License-Identifier: GPL v3.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CasinoGame.sol";

struct BlackjackPlayer {
    uint256 totalBet;
    bool isBust;
    bool isBlackjack;
    /* Use separate string arrays instead of Card struct to resolve
    * "Copying of type struct memory[] memory to storage not yet supported" errors
    */
    string[] cVals;
    string[] cSuits;
}

struct BlackjackGame {
    BlackjackPlayer player;
    BlackjackPlayer dealer;
}

/* The Blackjack contract defines specific state variables
*  and functions for a user to play Blackjack at the Casino.
*/
contract Blackjack is Ownable, CasinoGame {

    // State variables
    mapping (address => bool) private isPlayingRound;
    mapping (address => BlackjackGame) private bjGames;
    string[13] private cardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    string[4] private cardSuits = ["Diamonds", "Clubs", "Hearts", "Spades"];
    uint8 private numDecks = 4;

    // Events (to be emitted)
    event NewRound(address player, uint256 initialBet);
    event PlayerCardsUpdated(address player, string[] cardVals, string[] cardSuits);
    event DealerCardsUpdated(address player, string[] cardVals, string[] cardSuits);
    event PlayerBetUpdated(address player, uint256 newBet);

    // Updates the value of numDecks, the number of decks to play with
    function setNumDecks(uint8 _decks) public onlyOwner {
        require(_decks > 0, "At least one deck required.");
        numDecks = _decks;
    }

    // Sets the value of isPlayingRound to true or false for a player
    function setIsPlayingRound(address _address, bool _isPlaying) internal {
        isPlayingRound[_address] = _isPlaying;
    }

    // Handles the initial start of a blackjack round. It creates a new BlackjackGame with
    // a new player and dealer. It also sets the isPlayingRound and gameInProgress attributes
    // to true. Lastly, it handles the initial dealing of cards to the player and the dealer.
    function playRound(uint256 _betAmount, address _playerAddress) public {
        // Only start the round if player is not in the middle of a game or an existing round.
        // Check that the paid bet is large enough.
        require(gameInProgress[_playerAddress] == false, "Already playing game.");
        require(isPlayingRound[_playerAddress] == false, "Already playing round.");
        require(_betAmount >= minimumBet, "Bet is too small.");

        //  Initialize new game round
        BlackjackPlayer memory player;
        BlackjackPlayer memory dealer;
        bjGames[_playerAddress] = BlackjackGame(player, dealer);
        bjGames[_playerAddress].player.totalBet = _betAmount;
        setIsPlayingRound(_playerAddress, true);
        setGameInProgress(_playerAddress, true);

        // Let front end know a new round has begun
        emit NewRound(msg.sender, _betAmount);

        // Handle initial dealing of cards
        deal(_playerAddress);
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
    function deal(address _address) internal {
        require(isPlayingRound[_address] == true, "Not playing round.");
        BlackjackGame storage game = bjGames[_address];
        dealSingleCard(game, game.player);
        dealSingleCard(game, game.dealer);
        dealSingleCard(game, game.player);
        dealSingleCard(game, game.dealer);

        // Let front end know the player and dealer hands
        emit PlayerCardsUpdated(msg.sender, game.player.cVals, game.player.cSuits);
        emit DealerCardsUpdated(msg.sender, game.dealer.cVals, game.dealer.cSuits);
    }

    // Handles splitting cards from a player's hand.
    function splitPlayer() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

        emit PlayerCardsUpdated(msg.sender, bjGames[msg.sender].player.cVals, bjGames[msg.sender].player.cSuits);
    }

    // Handles doubling down on a hand.
    function doubleDown() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

        emit PlayerCardsUpdated(msg.sender, bjGames[msg.sender].player.cVals, bjGames[msg.sender].player.cSuits);
    }

    // Handles dealing another card to the player.
    function hitPlayer() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

        emit PlayerCardsUpdated(msg.sender, bjGames[msg.sender].player.cVals, bjGames[msg.sender].player.cSuits);
    }

    // Handles finishing a player's turn.
    function standPlayer() public {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");
    }

    // Handles dealing another card to the dealer.
    function hitDealer() public {
        emit DealerCardsUpdated(msg.sender, bjGames[msg.sender].dealer.cVals, bjGames[msg.sender].dealer.cSuits);
    }

    // Handles finishing a dealer's turn.
    function standDealer() public {
    }

    // Handles selecting and dealing a single card to the specified player.
    function dealSingleCard(BlackjackGame storage _game, BlackjackPlayer storage _player) private {
        require(isPlayingRound[msg.sender] == true, "Not playing round.");

        bool validCard = false;
        uint tries = 0;
        string memory cv;
        string memory cs;

        while(!validCard) {
            // Select random card value from deck
            cv = cardValues[rand(cardValues.length)];
            // Select random suit from deck
            cs = cardSuits[rand(cardSuits.length)];
            // Verify card selection is valid
            validCard = cardLeftInDeck(_game, cv, cs);

            // With a single player, all cards in the deck should never be dealt.
            // However, just in case, break out of the loop if all cards have been dealt.
            tries++;
            require(tries <= numDecks*52, "No cards left to deal.");
        }

        // Update value and suit, then add to player's cards
        _player.cVals.push(cv);
        _player.cSuits.push(cs);

        require(_player.cVals.length == _player.cSuits.length, "Error dealing card.");
    }

    // Resets a BlackjackGame and all the internal attributes.
    function resetBJGame(BlackjackGame storage _game) internal {
        // Reset player attributes
        _game.player.totalBet = 0;
        _game.player.isBust = false;
        _game.player.isBlackjack = false;
        delete _game.player.cVals;
        delete _game.player.cSuits;

        // Reset dealer attributes
        _game.dealer.isBust = false;
        _game.dealer.isBlackjack = false;
        delete _game.dealer.cVals;
        delete _game.dealer.cSuits;
    }

    // Returns the integer value of a card. Returns 0 for Ace. Returns type(uint16).max if 
    // _card is uninitialized.
    function getCardValue(string memory _value) public pure returns (uint16) {
        if(bytes(_value).length == 0) {
            if(isAlphaUpper(_value)) {
                if(keccak256(abi.encodePacked((_value))) == keccak256(abi.encodePacked(("A"))))
                    return 0;
                else
                    return 10;
            } else
                return uint16(safeParseInt(_value));
        }
        return type(uint16).max;
    }

    // Checks if a card has not yet been dealt in the provided game. Returns true if it has
    // not yet been dealt, otherwise false.
    function cardLeftInDeck(BlackjackGame storage _game, string memory _cardVal, string memory _cardSuit) internal view returns (bool) {
        uint8 occurrences = 0;
        // Check player cards
        for (uint i = 0; i < _game.player.cVals.length; i++) {
            if(keccak256(abi.encodePacked((_game.player.cVals[i]))) == keccak256(abi.encodePacked((_cardVal))) && 
                keccak256(abi.encodePacked((_game.player.cSuits[i]))) == keccak256(abi.encodePacked((_cardSuit))))
                occurrences++;
        }
        // Check dealer cards
        for (uint i = 0; i < _game.dealer.cVals.length; i++) {
            if(keccak256(abi.encodePacked((_game.dealer.cVals[i]))) == keccak256(abi.encodePacked((_cardVal))) && 
                keccak256(abi.encodePacked((_game.dealer.cSuits[i]))) == keccak256(abi.encodePacked((_cardSuit))))
                occurrences++;
        }

        return occurrences < numDecks;
    }

    // Returns true if a string contains only uppercase alphabetic characters
    function isAlphaUpper(string memory _str) public pure returns (bool) {
        bytes memory b = bytes(_str);

        for(uint i; i< b .length; i++){
            bytes1 char = b[i];

            if(!(char >= 0x41 && char <= 0x5A))
                return false;
        }
        return true;
    }

    // Generates a random number, 0 to _upper (non-inclusive), to be used for card selection.
    // Not truly random, but good enough for the needs of this project.
    // A mainnet application should use something like Chainlink VRF for this task instead.
    function rand(uint256 _upper) public view returns(uint256) {
    uint256 seed = uint256(keccak256(abi.encodePacked(
        block.timestamp + block.difficulty +
        ((uint256(keccak256(abi.encodePacked(block.coinbase)))) / (block.timestamp)) +
        block.gaslimit + 
        ((uint256(keccak256(abi.encodePacked(msg.sender)))) / (block.timestamp)) +
        block.number
    )));

    return (seed - ((seed / _upper) * _upper));
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
                require(!decimals, "More than one decimal found!");
                decimals = true;
            } else {
                revert("Non-numeral character found!");
            }
        }
        if (_b > 0) {
            mint *= 10 ** _b;
        }
        return mint;
    }
}