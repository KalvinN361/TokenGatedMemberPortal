import { magic } from '@libs/magic';
import { useWeb3 } from '@context/Web3Context';
import { useDispatch, useSelector } from 'react-redux';
import { setEmail, setReferral, setWalletAddress } from '@state/features';
import { FC } from 'react';
import { Contract } from '@definitions/Contract';
import { RootState } from '@state/store';
import { Magic } from 'magic-sdk';

interface MagicDisconnectButtonProps {
    disabled: boolean;
}

export const MagicDisconnectButton: FC<MagicDisconnectButtonProps> = (
    props
) => {
    // Get the initializeWeb3 function from the Web3 context
    const { disabled } = props;

    const { initializeWeb3 } = useWeb3();
    const dispatch = useDispatch();

    // Define the event handler for the button click
    const handleDisconnect = async () => {
        try {
            // Try to disconnect the user's wallet using Magic's logout method
            await magic.user.logout();
            dispatch(setEmail(''));
            dispatch(setReferral(''));
            dispatch(setWalletAddress(''));

            // After successful disconnection, re-initialize the Web3 instance
            initializeWeb3();
        } catch (error) {
            // Log any errors that occur during the disconnection process
            console.log('handleDisconnect:', error);
        }
    };

    // Render the button component with the click event handler
    return (
        <button onClick={handleDisconnect} disabled={disabled}>
            DISCONNECT
        </button>
    );
};
