import React, { Dispatch } from 'react';
import { Asset } from '@definitions/Asset';
import { FaRegPaperPlane } from 'react-icons/fa6';
import { PVCard, PVCardButton, PVCardBackHeader, PVCardFront } from '../Base';
import PVCardBack from '@components/Base/PVCard/PVCardBack';
import PVCardBackBody from '@components/Base/PVCard/PVCardBackBody';
import PVCardBackFooter from '@components/Base/PVCard/PVCardBackFooter';

type TransferCardProps<
    P = {
        asset: Asset;
        setOpenTransferModal: Dispatch<React.SetStateAction<boolean>>;
        setSelectedTransferAsset: Dispatch<React.SetStateAction<Asset | null>>;
    },
> = P;

export const TransferCardContainer: React.FC<TransferCardProps> = (props) => {
    const { asset, setOpenTransferModal, setSelectedTransferAsset } = props;
    const imageUrl = asset.imageSmall || asset.image;
    const imageAlt = asset.name;
    const tokenId = asset.tokenId;
    const name = asset.name;
    const transferCardId =
        asset.name.toLowerCase().replace(/[:\s\-#]+/gm, '-') +
        '-' +
        asset.tokenId;

    const handleTransferModal = () => {
        setOpenTransferModal(true);
        setSelectedTransferAsset(asset);
    };

    return (
        <PVCard id={transferCardId} type={'assets'}>
            <PVCardFront id={'transfer-front'}>
                <img src={imageUrl} alt={imageAlt} />
            </PVCardFront>
            <PVCardBack id={'back'}>
                <PVCardBackHeader id={'transfer-back-header'}>
                    <p className={'tokenId'}>Token No. {tokenId}</p>
                    <p className={'name'}>{name}</p>
                </PVCardBackHeader>
                <PVCardBackBody id={'transfer-back-body'}>
                    <PVCardButton
                        id={'transfer-button'}
                        handleOnClick={handleTransferModal}
                    >
                        <FaRegPaperPlane className={'icon'} />
                        Transfer
                    </PVCardButton>
                </PVCardBackBody>
                <PVCardBackFooter
                    id={'transfer-back-footer'}
                ></PVCardBackFooter>
            </PVCardBack>
        </PVCard>
    );
};
