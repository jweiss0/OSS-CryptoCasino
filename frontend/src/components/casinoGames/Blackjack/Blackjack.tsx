import { ReactElement, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import { BlackjackContractAddr, CasinoContractAddr, ChipContractAddr } from '../../../utils/environment';
import BlackjackArtifacts from '../../../artifacts/contracts/Blackjack.sol/Blackjack.json';
import ChipArtifacts from '../../../artifacts/contracts/Chip.sol/Chip.json';
import { Provider } from '../../../utils/provider';
import { BlackjackHand } from '../../../utils/types';

export function Blackjack(): ReactElement {
    const context = useWeb3React<Provider>();
    const { library, active } = context;

    const [signer, setSigner] = useState<Signer>();
    const [blackjackContract, setBlackjackContract] = useState<Contract>();
    const [chipContract, setChipContract] = useState<Contract>();
    const [minBet, setMinBet] = useState<string>("1000000000000000000");
    const [maxBet, setMaxBet] = useState<string>("50000000000000000000");
    const [bet, setBet] = useState<string>("1000000000000000000");
    const [inProgress, setInProgress] = useState<boolean>(false);
    const [playerHand1, setPlayerHand1] = useState<BlackjackHand>();
    const [playerHand2, setPlayerHand2] = useState<BlackjackHand>();
    const [playerHand3, setPlayerHand3] = useState<BlackjackHand>();
    const [playerHand4, setPlayerHand4] = useState<BlackjackHand>();

    // const [allowance, setAllowance] = useState<string>("0");

    // Get connected wallet information
    useEffect((): void => {
        if (!library) {
            setSigner(undefined);
            return;
        }

        setSigner(library.getSigner());
    }, [library]);

    // Get Blackjack contract read/write connection
    useEffect((): void => {
        if (blackjackContract || !signer)
            return;

        if (!BlackjackContractAddr)
            return;

        const blackjackContractInstance = new ethers.Contract(BlackjackContractAddr, BlackjackArtifacts.abi, signer);
        setBlackjackContract(blackjackContractInstance);

        console.log("Connected to Blackjack contract.");
    }, [blackjackContract, signer]);

    // Get Chip contract read/write connection
    useEffect((): void => {
        if (chipContract || !signer)
            return;

        if (!ChipContractAddr)
            return;

        const chipContractInstance = new ethers.Contract(ChipContractAddr, ChipArtifacts.abi, signer);
        setChipContract(chipContractInstance);

        console.log("Connected to Chip contract.");
    }, [chipContract, signer]);

    // Get minimum and maximum bet values
    useEffect((): void => {
        async function getMinBet(): Promise<void> {
            if (!blackjackContract)
                return;

            const _minBet = await blackjackContract.getMinimumBet();
            if (_minBet !== minBet) {
                setMinBet(_minBet);
            }
        }

        async function getMaxBet(): Promise<void> {
            if (!blackjackContract) {
                return;
            }

            const _maxBet = await blackjackContract.getMaximumBet();
            if (_maxBet !== maxBet) {
                setMaxBet(_maxBet);
            }
        }

        getMinBet();
        getMaxBet();
    }, []);

    // Event listeners for Blackjack events
    const contractPaidEvent = (player: string, amount: Number): void => {
        console.log("Contract Paid Event:");
        console.log(player);
        console.log(amount);
    }
    const playerCardsUpdatedEvent = (player: string, hand1: BlackjackHand, hand2: BlackjackHand, hand3: BlackjackHand, hand4: BlackjackHand): void => {
        console.log("Player Cards Updated.");
        const newPlayerHand1: BlackjackHand = hand1;
        const newPlayerHand2: BlackjackHand = hand2;
        const newPlayerHand3: BlackjackHand = hand3;
        const newPlayerHand4: BlackjackHand = hand4;
        setPlayerHand1(newPlayerHand1);
        setPlayerHand2(newPlayerHand2);
        setPlayerHand3(newPlayerHand3);
        setPlayerHand4(newPlayerHand4);
    }
    useEffect((): () => void => {
        blackjackContract?.on('ContractPaid', contractPaidEvent);
        blackjackContract?.on('PlayerCardsUpdated', playerCardsUpdatedEvent);

        return () => {
            blackjackContract?.off('ContractPaid', contractPaidEvent);
            blackjackContract?.off('PlayerCardsUpdated', playerCardsUpdatedEvent);
        };
    }, [blackjackContract]);

    // Handle "Play Round" button click
    async function handlePlayRound(): Promise<void> {
        if (!blackjackContract || !chipContract)
            return;

        if (bet < minBet || bet > maxBet) {
            window.alert('Error!\n\nBet must be between ' +  minBet + ' and ' + maxBet + '.');
            return;
        }

        // First approve contract to take CHIPs on user's behalf
        try {
            const approveTxn = await chipContract.approve(CasinoContractAddr, bet);
            await approveTxn.wait();
        } catch (error: any) {
            window.alert('Error!' + (error && error.message ? `\n\n${error.message}` : ''));
        }

        // Then call playRound function
        try {
            const playRoundTxn = await blackjackContract.playRound(bet);
            await playRoundTxn.wait();
        } catch (error: any) {
            window.alert('Error!' + (error && error.message ? `\n\n${error.message}` : ''));
        }

        setInProgress(true);
    }

    return (
        <div>
            <h1>Blackjack Page</h1>
            {!inProgress ? 
                <button
                    disabled={!active || !blackjackContract ? true : false}
                    style={{
                        cursor: !active || !blackjackContract ? 'not-allowed' : 'pointer',
                        borderColor: !active || !blackjackContract ? 'unset' : 'blue'
                    }}
                    onClick={handlePlayRound}
                >
                    Play Round
                </button>
            : <></>
            }
            
            {playerHand1 && playerHand1.cSuits && playerHand1.cVals ? 
                playerHand1.cVals.map((cardVal, i) => {
                    return (<p key={i}>Card {i}: {cardVal} of {playerHand1.cSuits[i]}</p>);
                })
                : <></>}                
        </div>
    );
}

export default Blackjack;