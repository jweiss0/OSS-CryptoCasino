import React, { Component, useState } from "react";
import ReactDOM from "react";
import "../style.css";

/**
 * Objects for cards and deck of cards
 */
 const cardValues: string[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
 const suits = ["Spades", "Clubs", "Hearts", "Diamonds"];

interface CardProps {
    valueIndex: number;
    suitIndex: number;
}

interface CardState {
    suit: string;
    value: string;
    cardValue: number;
    hidden: boolean;
    isInHand: boolean;
}


export default class Card extends Component<CardProps, CardState>{
    constructor(props: CardProps){
        super(props);
        this.state = {
            suit: suits[props.suitIndex],
            value: cardValues[props.valueIndex],
            cardValue: this.setCardVal(props.valueIndex),
            // to be used in the dealer's hand
            hidden: false,
            isInHand: false
        };
    }
    setCardVal(valueIndex: number) {
        if(valueIndex >= 10){
            return 10;
        }
        else if(valueIndex == 0){
            return 11;
        }
        return valueIndex + 1
    }
    getCardVal(){
        return this.state.cardValue;
    }
    adjustHidden(){
        this.setState((state) => {
            return {hidden: !state.hidden};
          });
    }
    isAce(){
        if(this.state.value == "A"){
            return true;
        }
    }
    // handling user choice to change value of Ace
    changeAceValue = () =>{
        if(!this.isAce()){
            return;
        }
        else if(this.state.cardValue == 11){
            this.setState({cardValue: 1}); 
            return;
        }
        this.setState({cardValue: 11});
        return;
    }

    render(){
        return(
            <div className="card" onClick={this.changeAceValue.bind(this)}>${`${this.state.value} of ${this.state.suit}`}</div>
        );
    }
}

