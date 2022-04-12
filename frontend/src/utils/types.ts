export interface BlackjackHand {
    isBust: boolean;
    isBlackjack: boolean;
    isDoubledDown: boolean;
    fromSplit: boolean;
    bet: string;
    cVals: string[];
    cSuits: string[];
}