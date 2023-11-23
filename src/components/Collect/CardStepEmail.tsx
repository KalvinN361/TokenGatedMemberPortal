import React, { useEffect, useState } from 'react';
import { CardStep3Props } from '@definitions/Collect';
import {
    CollectAssetShow,
    CollectButton,
    CollectButtonContainer,
    CollectCard,
    CollectQuestion,
} from '@styles/Collect.styled';
import { Magic } from 'magic-sdk';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/store';
import {
    MagicDisconnectButton,
    MagicConnectButton,
    Spinner,
} from '@components/index';
import { useUser } from '@context/UserContext';
import { setWalletAddress } from '@state/features';
import ShowUIButton from '@components/Magic/MagicShowUIButton';
import WalletDetail from '@components/Magic/MagicWalletDetail';
import { delay } from '@reduxjs/toolkit/dist/utils';
import { Api } from '@libs/API';
import { Asset } from '@definitions/Asset';
import { useNavigate } from 'react-router-dom';

export const CardStepEmail: React.FC<CardStep3Props> = (props) => {
    const { handleStepClick } = props;
    const { REACT_APP_MAGIC_KEY } = process.env;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useUser();
    const collect = useSelector((state: RootState) => state.collect);
    const owner = useSelector((state: RootState) => state.owner);
    const [processing, setProcessing] = useState<boolean>(false);
    const [transferredAsset, setTransferredAsset] = useState<Asset>();

    const magic = new Magic(REACT_APP_MAGIC_KEY as string);

    const handlePortalClick = () => {
        navigate('/');
    };

    useEffect(() => {
        if (!user) return;
        dispatch(setWalletAddress(user));
    }, [user]);

    useEffect(() => {
        if (!owner.walletAddress) return;
        setProcessing(true);
        (async () => {
            let asset = await Api.collect.transferBMOE(
                collect.drop.id,
                owner.walletAddress,
                collect.email
            );
            setTransferredAsset(asset);
        })();
        magic.wallet.disconnect();
        setProcessing(false);
        // TODO: TransferCard NFT to wallet API call
    }, [collect.drop, owner.walletAddress, collect.email]);

    return (
        <CollectCard>
            {!owner.walletAddress && (
                <CollectQuestion>
                    <p>Let's create your e-mail wallet.</p>
                    <p className={'email'}>{collect.email}</p>
                    <p>Ready?</p>
                </CollectQuestion>
            )}
            {owner.walletAddress && (
                <CollectQuestion>
                    <p>You're connected!</p>
                </CollectQuestion>
            )}
            <CollectButtonContainer
                className={'relative' + user ? 'connected' : ''}
            >
                {!user && (
                    <div className={'flex flex-row justify-between w-full'}>
                        <CollectButton value={0} onClick={handleStepClick}>
                            NO
                        </CollectButton>
                        <MagicConnectButton />
                    </div>
                )}
                {user && !transferredAsset && (
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
                                wallet! Please do not refresh or close this.
                                This can several minutes.
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
            )}{' '}
        </CollectCard>
    );
};
