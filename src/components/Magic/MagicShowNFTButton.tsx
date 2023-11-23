import { useEffect, useState } from 'react';
import { Contract } from '@definitions/Contract';
import { useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { Magic } from 'magic-sdk';

const ShowNFTButton = () => {
    // Initialize state variable to decide whether to show button or not
    const { REACT_APP_MAGIC_KEY } = process.env;
    const collect = useSelector((state: RootState) => state.collect);
    const { chainId, chainURL } = collect.drop;

    const magic = new Magic(REACT_APP_MAGIC_KEY as string, {
        network: {
            rpcUrl: chainURL,
            chainId: chainId,
        },
    });
    const [showButton, setShowButton] = useState(false);

    // Define a function to check the type of the wallet
    const checkWalletType = async () => {
        try {
            // Fetch the wallet's information using Magic's user.getInfo method
            const walletInfo = await magic.user.getInfo();

            ///@ts-ignore
            // Determine if the wallet type is "magic"
            const isMagicWallet = walletInfo.walletType === 'magic';

            // Set 'showButton' state based on the result of the check
            setShowButton(isMagicWallet);
        } catch (error) {
            // Log any errors that occur during the wallet type check process
            console.error('checkWalletType:', error);
        }
    };

    useEffect(() => {
        // Call the checkWalletType function
        checkWalletType();
    }, [magic]);

    // Define the event handler for the button click
    const handleShowNFT = async () => {
        try {
            // Try to show the magic wallet user interface
            await magic?.wallet.showNFTs();
        } catch (error) {
            // Log any errors that occur during the process
            console.error('handleShowNFT:', error);
        }
    };

    // Render the button component if showButton is true, otherwise render nothing
    return showButton ? (
        <button onClick={handleShowNFT}>Show NFTs</button>
    ) : null;
};

export default ShowNFTButton;
