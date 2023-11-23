import React, { useEffect, useState } from 'react';
import { CardStep2Props } from '@definitions/Collect';
import {
    CollectAssetShow,
    CollectButton,
    CollectButtonContainer,
    CollectCard,
    CollectQuestion,
} from '@styles/Collect.styled';
import { Magic } from 'magic-sdk';
import { setWalletAddress } from '@state/features';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { useWeb3Modal } from '@web3modal/react';
import { Asset } from '@definitions/Asset';
import { Api } from '@libs/API';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@components/Base';

export const CardStepWallet: React.FC<CardStep2Props> = (props) => {
    const { handleStepClick } = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { open, close } = useWeb3Modal();
    const { isConnected, isDisconnected, address, status } = useAccount();
    const { disconnect } = useDisconnect();
    const [message, setMessage] = useState<string>('');
    const [processing, setProcessing] = useState<boolean>(false);
    const [transferredAsset, setTransferredAsset] = useState<Asset | null>(
        null
    );

    const collect = useSelector((state: RootState) => state.collect);
    const owner = useSelector((state: RootState) => state.owner);
    const label = isConnected ? 'DISCONNECT' : 'CONNECT';

    const {
        data,
        isError,
        error,
        isLoading,
        isSuccess,
        signMessage,
        signMessageAsync,
        reset,
    } = useSignMessage({
        message: message,
        onError(error) {
            console.log('PV::Error::', error);
        },
        onSuccess(data) {
            console.log(`PV::${new Date().toISOString()}::Message Signed`);
        },
    });

    const onOpen = async () => {
        console.log('PV::onOpen::Loading Wallet Connect');
        await open();
        console.log('PV::onOpen::Finished Loading Wallet Connect');
    };
    const handleWalletConnect = async () => {
        if (isConnected) {
            console.log(`PV::${new Date().toISOString()}::Disconnecting`);
            disconnect();
            close();
            new Magic(process.env.REACT_APP_MAGIC_KEY as string).user.logout();
            reset();
            dispatch(setWalletAddress(''));
        } else await onOpen();
    };

    const handlePortalClick = () => {
        navigate('/');
    };

    useEffect(() => {
        if (!isConnected) return;
        console.log(`PV::${new Date().toISOString()}::Connected`);
        dispatch(setWalletAddress(address as string));
        // TODO: TransferCard NFT to wallet API call
    }, [isConnected]);

    useEffect(() => {
        if (!owner.walletAddress) return;
        setProcessing(true);
        (async () => {
            let asset = await Api.collect.transferBMOE(
                collect.drop.id,
                owner.walletAddress
            );
            setTransferredAsset(asset);
        })();
        disconnect();
        setProcessing(false);
    }, [collect, owner.walletAddress]);

    return (
        <CollectCard>
            <CollectQuestion>
                {isConnected ? (
                    <p>You're connected!</p>
                ) : (
                    <p>Let's connect your wallet</p>
                )}
            </CollectQuestion>
            <CollectButtonContainer className={isConnected ? 'connected' : ''}>
                {!isConnected && (
                    <CollectButton
                        className={'yes'}
                        value={0}
                        onClick={handleStepClick}
                    >
                        GO BACK
                    </CollectButton>
                )}
                {!transferredAsset && label === 'CONNECT' && (
                    <CollectButton
                        className={'no'}
                        value={5}
                        // TODO: Add Connect Wallet functionality
                        onClick={handleWalletConnect}
                    >
                        {label}
                    </CollectButton>
                )}
                {!transferredAsset && label === 'DISCONNECT' && (
                    <div className={'flex relative flex-col'}>
                        {/*<ShowUIButton />*/}
                        {/*<ShowNFTButton />*/}
                        {/*<MagicDisconnectButton disabled={processing} />*/}
                        <Spinner
                            hidden={processing}
                            background={false}
                            absolute={false}
                        />
                        <div>
                            <p>
                                Please wait while we add your gift to your
                                wallet!
                            </p>
                        </div>
                    </div>
                )}
                {transferredAsset && (
                    <div>
                        <CollectButton
                            className={'portal'}
                            onClick={handlePortalClick}
                        >
                            Go To Member Portal
                        </CollectButton>
                    </div>
                )}
            </CollectButtonContainer>
            {transferredAsset && (
                <CollectAssetShow>
                    <img src={transferredAsset.image} />{' '}
                    {`Token ${transferredAsset.tokenId} is now in your wallet`}
                </CollectAssetShow>
            )}
        </CollectCard>
    );
};
