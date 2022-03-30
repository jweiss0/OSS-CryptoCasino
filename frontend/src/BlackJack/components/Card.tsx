import React, { Component, useState } from "react";
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
}


export default class Card extends Component<CardProps, CardState>{
    constructor(props: CardProps){
        super(props);
        this.state = {
            suit: suits[props.suitIndex],
            value: cardValues[props.valueIndex],
            cardValue: this.getCardVal(props.valueIndex),
            // to be used in the dealer's hand
            hidden: false
        };
    }
    getCardVal(valueIndex: number) {
        if(valueIndex >= 10){
            return 10;
        }
        else if(valueIndex == 0){
            return 11;
        }
        return valueIndex + 1
    }
    adjustHidden(){
        this.setState((state) => {
            return {hidden: !state.hidden};
          });
    }
    // handling user choice to change value of Ace
    changeAceValue(){
        if(this.state.cardValue == 11){
            this.setState((state) => {
                return {cardValue: 1};
              });
        }
        else if(this.state.cardValue == 1){
            this.setState((state) => {
                return {cardValue: 11};
              });
        }
    }

    render(){
        return(
            <div className="card">${`${this.state.value} of ${this.state.suit}`}</div>
        );
    }
}

