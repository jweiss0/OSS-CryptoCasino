import React, { Component } from "react";
import "../styles.css";
import Card from "./Card";


interface PlayerProps {
    name: string;
    isDealer: boolean;
}
interface PlayerState {
    name: string;
    hand: Card[];
    handValue: number;
    isDealer: boolean;
}

export default class Player extends Component<PlayerProps, PlayerState> {
    constructor(props: PlayerProps){
        super(props);
        this.state = {
            name: props.name,
            hand: [] as Card[],
            handValue: 0,
            isDealer: props.isDealer
        };
    }
    addCard(card: Card){
        this.setState(prevState => ({
            hand: [...prevState.hand, card],
            handValue: prevState.handValue + card.getCardVal()
          }));
        this.hideCard();       
    }
    getHandValue(){
        return this.state.handValue;
    }
    getIsDealer(){
        return this.state.isDealer;
    }
    getHand(){
        return this.state.hand;
    }
    hideCard(){
        if(this.state.isDealer && this.state.hand.length == 2){
            let dHand = this.state.hand.slice()
            dHand[1].adjustHidden();
        }
    }

    render(){
        return(
            <div>Player Hand</div>
        );
    }
}