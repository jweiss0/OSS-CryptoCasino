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
         else if (value === "A"){
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

//see cards for testing
document.write("Your hand: " + JSON.stringify(p1, null, 5) + "<br><br>");
document.write("Dealer's hand: " + JSON.stringify(dealer, null, 5) + "<br><br>");

//player chooses to hit
function hit(player) {
    document.write("You chose to hit <br><br>");
    let hitCard = newDeck.dealCard();
    player.addCard(hitCard);
}
hit(p1);
//player chooses to stand
 
//see cards for testing
document.write("Your hand: " + JSON.stringify(p1, null, 5) + "<br><br>");
document.write("Dealer's hand: " + JSON.stringify(dealer, null, 5) + "<br><br>");
