import { ReactElement, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import { BlackjackContractAddr } from '../../../utils/environment';
import BlackjackArtifacts from '../../../artifacts/contracts/Blackjack.sol/Blackjack.json';
import { Provider } from '../../../utils/provider';

export function Blackjack(): ReactElement {
    const context = useWeb3React<Provider>();
    const { library, active } = context;

    const [signer, setSigner] = useState<Signer>();
    const [blackjackContract, setBlackjackContract] = useState<Contract>();
    const [minBet, setMinBet] = useState<Number>(1);
    const [maxBet, setMaxBet] = useState<Number>(500);
    const [bet, setBet] = useState<Number>(1);

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


    // Get minimum and maximum bet values
    useEffect((): void => {
        async function getMinBet(): Promise<void> {
            if (!blackjackContract) {
                return;
            }

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
    }, [blackjackContract, minBet, maxBet]);

    // Event listener for ContractPaid event (CasinoGame) [UNTESTED]
    const contractPaidEvent = (player: string, amount: Number): void => {
        console.log("Contract Paid Event:");
        console.log(player);
        console.log(amount);
    }
    useEffect((): () => void => {
        blackjackContract?.on('ContractPaid', contractPaidEvent);

        return () => {
            blackjackContract?.off('ContractPaid', contractPaidEvent);
        };
    }, [blackjackContract]);

    // Handle "Play Round" button click
    async function handlePlayRound(): Promise<void> {
        if (!blackjackContract)
            return;

        if (bet < minBet || bet > maxBet) {
            window.alert('Error!\n\nBet must be between ' +  minBet + ' and ' + maxBet + '.');
            return;
        }
        try {
            const playRoundTxn = await blackjackContract.playRound(bet);
            await playRoundTxn.wait();
        } catch (error: any) {
            window.alert('Error!' + (error && error.message ? `\n\n${error.message}` : ''));
        }
    }

    return (
        <div>
            <h1>Blackjack Page</h1>
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
        </div>
    );
}

export default Blackjack;