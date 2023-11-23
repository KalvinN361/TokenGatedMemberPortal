import React, { FC, useEffect } from 'react';
import {
    PVCard,
    PVCardBackFooter,
    PVCardBackHeader,
    PVCardFront,
} from '@components/Base';
import PVCardBack from '@components/Base/PVCard/PVCardBack';
import PVCardBackBody from '@components/Base/PVCard/PVCardBackBody';
import { Shop as ShopType } from '@definitions/Shop';
import { getUnitName } from '@libs/blockchain';
import styled from 'styled-components';
import tw from 'twin.macro';
import MaticLogo from '@assets/logos/matic-logo.svg';
import ETHLogo from '@assets/logos/eth-logo.svg';

type TradeCardProps<
    P = {
        trade: ShopType;
    },
> = P;

export const TradeCard: FC<TradeCardProps> = (props) => {
    const { trade } = props;
    const imageUrl = trade.asset.imageSmall || trade.asset.image;
    const imageAlt = trade.asset.name;
    const tokenId = trade.asset.tokenId;
    const name = trade.asset.name;
    const price = trade.price;
    const chainName = getUnitName(trade.asset.contract.chainId);
    const ownerAddress = trade.asset.owner.walletAddress;
    const id = `${trade.asset.contract.address}-${tokenId}`;

    useEffect(() => {
        console.log({ trade });
    }, [trade]);

    return (
        <PVCard type={'assets'} id={`card-${id}`}>
            <div className={'absolute top-0 left-0 h-8 w-8 p-2 grayscale'}>
                {trade.asset.contract.chainId === 137 ? (
                    <img src={MaticLogo} alt={'Matic'} />
                ) : (
                    <img src={ETHLogo} alt={'ETH'} />
                )}
            </div>
            <PVCardFront id={'trade-front'}>
                <img src={imageUrl} alt={imageAlt} />
            </PVCardFront>
            <PVCardBack id={'trade-back'}>
                <PVCardBackHeader id={'trade-back-header'}>
                    <p className={'tokenId'}>Token No. {tokenId}</p>
                    <p className={'name'}>{name}</p>
                </PVCardBackHeader>
                <PVCardBackBody id={'trade-back-body'}></PVCardBackBody>
                <PVCardBackFooter id={'trade-back-footer'}></PVCardBackFooter>
            </PVCardBack>
        </PVCard>
    );
};

const Price = styled.p`
    ${tw`font-bold text-xl text-white`}
`;

export default TradeCard;
