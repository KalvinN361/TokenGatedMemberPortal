import React, { Dispatch } from 'react';
import { BurnAsset } from '@definitions/Asset';
import { useDispatch } from 'react-redux';
import { setBurnOptionPanel, setCurrentBurnAsset } from '@state/features';
import { FaFire } from 'react-icons/fa';
import {
    PVCardBack,
    PVCardBackBody,
    PVCard,
    PVCardBackFooter,
    PVCardBackHeader,
    PVCardFront,
    PVCardButton,
} from '../Base';

type TransferCardProps<
    P = {
        asset: BurnAsset;
        setOpenBurnModal: Dispatch<React.SetStateAction<boolean>>;
        setSelectedBurnAsset: Dispatch<React.SetStateAction<BurnAsset | null>>;
    },
> = P;

export const BurnCardContainer: React.FC<TransferCardProps> = (props) => {
    const { asset, setOpenBurnModal, setSelectedBurnAsset } = props;
    const dispatch = useDispatch();
    const animation = asset.animation;
    const imageUrl = asset.imageSmall || asset.image;
    const imageAlt = asset.name;
    const tokenId = asset.tokenId;
    const name = asset.name;
    const burnCardId =
        asset.name.toLowerCase().replace(/[:\s\-#]+/gm, '-') +
        '-' +
        asset.tokenId;

    const handleBurnModal = () => {
        setOpenBurnModal(true);
        setSelectedBurnAsset(asset);
        dispatch(setCurrentBurnAsset(asset));
        dispatch(setBurnOptionPanel(asset.burnNow));
    };

    return (
        <PVCard id={burnCardId} type={'assets'}>
            <PVCardFront id="burn-front">
                {animation ? (
                    <video
                        autoPlay={true}
                        loop
                        muted
                        placeholder={imageUrl}
                        poster={imageUrl}
                    >
                        <source src={animation} type="video/mp4" />
                    </video>
                ) : (
                    <img src={imageUrl} alt={imageAlt} />
                )}
            </PVCardFront>
            <PVCardBack id={'burn-back'}>
                <PVCardBackHeader id={'burn-back-header'}>
                    <p className={'tokenId'}>Token No. {tokenId}</p>
                    <p className={'name'}>{name}</p>
                </PVCardBackHeader>
                <PVCardBackBody id={'burn-back-body'}>
                    <PVCardButton
                        id={'burn-button'}
                        handleOnClick={handleBurnModal}
                    >
                        <FaFire className={'icon'} />
                        Burn
                    </PVCardButton>
                </PVCardBackBody>
                <PVCardBackFooter id={'burn-back-footer'}></PVCardBackFooter>
            </PVCardBack>
        </PVCard>
    );
};
