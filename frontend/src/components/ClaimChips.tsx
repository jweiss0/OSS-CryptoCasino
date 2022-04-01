import { ReactElement, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import { CasinoContractAddr } from '../utils/environment';
import CasinoArtifacts from '../artifacts/contracts/Casino.sol/Casino.json';
import { Provider } from '../utils/provider';

export function ClaimChips(): ReactElement {
    const context = useWeb3React<Provider>();
    const { library, active } = context;

    const [signer, setSigner] = useState<Signer>();
    const [casinoContract, setCasinoContract] = useState<Contract>();
    const [alreadyClaimed, setAlreadyClaimed] = useState<boolean>(false);

    // Get connected wallet information
    useEffect((): void => {
        if (!library) {
            setSigner(undefined);
            return;
        }

        setSigner(library.getSigner());
    }, [library]);

    // Get Casino contract read/write
    useEffect((): void => {
        if (casinoContract || !signer)
            return;

        if (!CasinoContractAddr)
            return;

        const casinoContractInstance = new ethers.Contract(CasinoContractAddr, CasinoArtifacts.abi, signer);
        setCasinoContract(casinoContractInstance);

        console.log("Connected to Casino contract.");

    }, [casinoContract, signer]);


    // Check if free chips have already been claimed
    useEffect((): void => {
        async function getAlreadyClaimed(): Promise<void> {
            if (!casinoContract || !signer) {
                return;
            }

            // console.log(await signer.getAddress().then((addr) => {return addr;}));
            const _alreadyClaimed = await casinoContract.alreadyClaimedTokens();
            if (_alreadyClaimed !== alreadyClaimed) {
                setAlreadyClaimed(_alreadyClaimed);
            }
        }

        getAlreadyClaimed();
    }, [casinoContract, alreadyClaimed, signer]);

    // Handle "Claim Free Chips!" button click
    async function handleClaimChips(): Promise<void> {
        if (!casinoContract)
            return;

        if (alreadyClaimed) {
            window.alert('Error!\n\nAlready claimed free chips!');
            return;
        }
        try {
            const claimChipsTxn = await casinoContract.claimInitialTokens();
            await claimChipsTxn.wait();
        } catch (error: any) {
            window.alert('Error!' + (error && error.message ? `\n\n${error.message}` : ''));
        }
    }

    return (
        <div>
            {alreadyClaimed ? <></> : 
                <button
                    disabled={!active || !casinoContract ? true : false}
                    style={{
                        cursor: !active || !casinoContract ? 'not-allowed' : 'pointer',
                        borderColor: !active || !casinoContract ? 'unset' : 'blue'
                    }}
                    onClick={handleClaimChips}
                >
                    Claim Free Chips!
                </button>
            }
        </div>
    );
}

export default ClaimChips;