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

type ListingCardProps<
    P = {
        listing: ShopType;
    },
> = P;

export const ListingCard: FC<ListingCardProps> = (props) => {
    const { listing } = props;
    const imageUrl = listing.asset.imageSmall || listing.asset.image;
    const imageAlt = listing.asset.name;
    const tokenId = listing.asset.tokenId;
    const name = listing.asset.name;
    const price = listing.price;
    const chainName = getUnitName(listing.asset.contract.chainId);
    const ownerAddress = listing.asset.owner.walletAddress;
    const id = `${listing.asset.contract.address}-${tokenId}`;

    useEffect(() => {
        console.log({ listing });
    }, [listing]);

    return (
        <PVCard type={'assets'} id={`card-${id}`}>
            <div className={'absolute top-0 left-0 h-8 w-8 p-2 grayscale'}>
                {listing.asset.contract.chainId === 137 ? (
                    <img src={MaticLogo} alt={'Matic'} />
                ) : (
                    <img src={ETHLogo} alt={'ETH'} />
                )}
            </div>
            <PVCardFront id={'sales-front'}>
                <img src={imageUrl} alt={imageAlt} />
            </PVCardFront>
            <PVCardBack id={'sales-back'}>
                <PVCardBackHeader id={'sales-back-header'}>
                    <p className={'tokenId'}>Token No. {tokenId}</p>
                    <p className={'name'}>{name}</p>
                </PVCardBackHeader>
                <PVCardBackBody id={'sales-back-body'}></PVCardBackBody>
                <PVCardBackFooter
                    id={'sales-back-footer'}
                    className={'bg-black px-2'}
                >
                    <p className={'text-white'}>{ownerAddress}</p>
                    <Price id={`price-${id}`}>{`${price} ${chainName}`}</Price>
                </PVCardBackFooter>
            </PVCardBack>
        </PVCard>
    );
};

const Price = styled.p`
    ${tw`font-bold text-xl text-white`}
`;

export default ListingCard;
