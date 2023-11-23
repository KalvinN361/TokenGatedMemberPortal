import { useWeb3 } from '@context/Web3Context';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail } from '@state/features';
import { Magic } from 'magic-sdk';
import { RootState } from '@state/store';
import { Contract } from '@definitions/Contract';

export const MagicConnectButton = () => {
    const { REACT_APP_MAGIC_KEY } = process.env;
    const dropContract: Contract = useSelector(
        (state: RootState) => state.collect.drop
    );
    const { chainId, chainURL } = dropContract;

    const magic = new Magic(REACT_APP_MAGIC_KEY as string, {
        network: {
            rpcUrl: chainURL,
            chainId: chainId,
        },
    });
    // Get the initializeWeb3 function from the Web3 context
    const { initializeWeb3 } = useWeb3();
    const dispatch = useDispatch();

    // Define the event handler for the button click
    const handleConnect = async () => {
        try {
            // Try to connect to the wallet using Magic's user interface
            await magic.wallet.connectWithUI();
            const userInfo = await magic.user.requestInfoWithUI({
                scope: { email: 'required' },
            });
            dispatch(setEmail(userInfo?.email as string));

            // If connection to the wallet was successful, initialize new Web3 instance
            initializeWeb3();
        } catch (error) {
            // Log any errors that occur during the connection process
            console.error('handleConnect:', error);
        }
    };

    // Render the button component with the click event handler
    return <button onClick={handleConnect}>CONNECT</button>;
};
