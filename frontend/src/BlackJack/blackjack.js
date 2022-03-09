/**
 * Objects for cards and deck of cards
 */
 const cardValues = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
 const suits = ["Spades", "Clubs", "Hearts", "Diamonds"];
 
 /**
  * this.suit takes an integer between 0 and 3 which corresponds to its index in the suits array
  * this.value is the number or face displayed on the card
  * this.cardVal is the actual value of the card in Blackjack
  *     Face cards = 10
  *     Ace = 11 or 1
  *     Numbers = their value
  */
 class Card{
     constructor(suit, value){
         this.suit = suits[suit];
         this.value = cardValues[value];
         //when constructing the deck, face cards have values of 11, 12, 13
         if (value >= 10){
             this.cardVal = 10;
         }
         //for aces
         else if (value == 0){
             this.cardVal = 11;
         }
         //for regular numbers
         else{
             this.cardVal = Number(value) + 1;
         }
     }
     getVal(){
         return this.cardVal;
     }
 }
 
 /**
  * Object for deck of 52 cards
  * shuffleDeck is the Fisher-Yates shuffling algorithm
  */
 class Deck{
    constructor(){
        this.deck = [];
        for (let i = 0; i < 4; i++){
            for (let j = 0; j < 13; j++){
                let newCard = new Card(i, j);
                this.deck.push(newCard);
            }
        }
    }
    shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
    return this.deck;
    }

    //deal a card by removing the first card from the array
    dealCard(){
        return this.deck.shift();
    }
 }

 /**
  * Player class for the user and dealer
  * this.hand holds each players cards
  * this.handValue gives us their score
  * this.numAces is tracked in order to decide if its value is one or eleven
  */
 class Player{
     constructor(){
        this.hand = [];
        this.handValue = 0;
        this.numAces = 0;
     }
     //add a card to the player's hand, update hand value
     addCard(card){
         this.hand.push(card);
         this.handValue += card.getVal();
     }
     //return true if a player "busts"(gets hand value over 21)
     bust(){
         if (this.handValue > 21){
             return true;
         }
         return false;
     }
     //return true if a player has blackjack (handvalue = 21)
     blackjack(){
         if (this.handValue == 21){
             return true;
         }
         return false;
     }
 }
 
/**
 * Blackjack game
 * Start with a new deck and shuffle it
 * Deal two cards to the player and the 'dealer'
 */
let newDeck = new Deck();
newDeck.shuffleDeck();
let p1 = new Player();
let dealer = new Player();
 
 //deal initial hands
p1.addCard(newDeck.dealCard());
p1.addCard(newDeck.dealCard());
dealer.addCard(newDeck.dealCard());
dealer.addCard(newDeck.dealCard());

//check for player blackjack first
if (p1.blackjack()){
    endRound();
}

//link html elements
const p1Hand = document.getElementById("playerHand");
const dealersHand = document.getElementById("dealerHand");
const roundResult = document.getElementById("results");
document.getElementById("playAgain").disabled = true;


//update hand for dealer and player
document.getElementById('playerScore').innerHTML = "Your score: " + String(p1.handValue);
document.getElementById('dealerScore').innerHTML = "Dealer's score: " + String(dealer.handValue);
p1Hand.innerHTML += `<div class="card">${p1.hand[0].value + " of " + p1.hand[0].suit}</div>`;
p1Hand.innerHTML += `<div class="card">${p1.hand[1].value + " of " + p1.hand[1].suit}</div>`;
dealersHand.innerHTML += `<div class="card">${dealer.hand[0].value + " of " + dealer.hand[0].suit}</div>`;
dealersHand.innerHTML += `<div class="card">${dealer.hand[1].value + " of " + dealer.hand[1].suit}</div>`;


//This function represents the player's turn, where they can choose to hit or end their turn by standing
function playerTurn(playerChoice){
    switch (playerChoice){
        case 'hit':
            let hitCard = newDeck.dealCard();
            p1.addCard(hitCard);
            p1Hand.innerHTML += `<div class="card">${p1.hand[p1.hand.length-1].value + " of " + p1.hand[p1.hand.length-1].suit}</div>`;
            //p1Hand.insertAdjacentHTML('beforeend', `<div class="card">${p1.hand[p1.hand.length-1].value + " of " + p1.hand[p1.hand.length-1].suit}</div>`);
            document.getElementById('playerScore').innerHTML = "Your Score: " + String(p1.handValue);
            if (p1.bust()){
                endRound();
            }
            break;
        case 'stand':
            dealerTurn();
            break;
    }
}

//In this function, the dealer plays out his hand
//He will hit until he has 17 or higher
function dealerTurn(){
    if (dealer.handValue >= 17){
        endRound();
    }
    else{
        let hitCard = newDeck.dealCard();
        dealer.addCard(hitCard);
        dealersHand.innerHTML += `<div class="card">${dealer.hand[dealer.hand.length-1].value + " of " + dealer.hand[dealer.hand.length-1].suit}</div>`;
        document.getElementById('dealerScore').innerHTML = "Dealer's score: " + String(dealer.handValue);
        if (dealer.bust()){
            endRound();
        }
        dealerTurn();
    }
}

//This function ends the round
function endRound(){
    document.getElementById("hitButton").disabled = true;
    document.getElementById("standButton").disabled = true;
    if (p1.bust()){
        roundResult.innerHTML += "You Lose";
    }
    else if (dealer.bust()){
        roundResult.innerHTML += "You Win";
    }
    else if (dealer.handValue > p1.handValue){
        roundResult.innerHTML += "You Lose";
    }
    else if (p1.handValue > dealer.handValue){
        roundResult.innerHTML += "You Win";
    }
    else{
        roundResult.innerHTML += "It's a Draw";
    }
    document.getElementById("playAgain").disabled = false;
}

//This function resets the board so another round can be played (WIP)
function restart(){
    p1.hand = [];
    p1.handValue = 0;
    p1.numAces = 0;
    dealer.hand = [];
    dealer.handValue = 0;
    dealer.numAces = 0;
    document.getElementById("playerScore").innerHTML = "Your Score: 0";
    document.getElementById("dealerScore").innerHTML = "Dealer's Score: 0";
    document.getElementById("playerHand").innerHTML = "<p>Your Hand:</p>";
    document.getElementById("dealerHand").innerHTML = "<p>Dealer's Hand:</p>";
    document.getElementById("results").innerHTML = "Result: ";

    //deal initial hands
    p1.addCard(newDeck.dealCard());
    p1.addCard(newDeck.dealCard());
    dealer.addCard(newDeck.dealCard());
    dealer.addCard(newDeck.dealCard());

    //check for player blackjack first
    if (p1.blackjack()){
        endRound();
    }

    //link html elements
    //const p1Hand = document.getElementById("playerHand");
    //const dealersHand = document.getElementById("dealerHand");
    //const roundResult = document.getElementById("results");
    document.getElementById("playAgain").disabled = true;
    document.getElementById("hitButton").disabled = false;
    document.getElementById("standButton").disabled = false;

    //update hand for dealer and player
    document.getElementById('playerScore').innerHTML = "Your score: " + String(p1.handValue);
    document.getElementById('dealerScore').innerHTML = "Dealer's score: " + String(dealer.handValue);
    document.getElementById("playerHand").innerHTML += `<div class="card">${p1.hand[0].value + " of " + p1.hand[0].suit}</div>`;
    p1Hand.innerHTML += `<div class="card">${p1.hand[1].value + " of " + p1.hand[1].suit}</div>`;
    //dealersHand.innerHTML += `<div class="card">${dealer.hand[0].value + " of " + dealer.hand[0].suit}</div>`;
    //dealersHand.innerHTML += `<div class="card">${dealer.hand[1].value + " of " + dealer.hand[1].suit}</div>`;
}
