import React from 'react';
import { UnclaimedCoinAsset } from '@definitions/UnclaimedCoin';
import OpenSeaLogo from '@assets/logos/OpenSea.png';
import CoinbaseLogo from '@assets/logos/CoinbaseNFT.png';
import {
    PVCard,
    PVCardBackFooter,
    PVCardBackHeader,
    PVCardButton,
    PVCardFront,
} from '@components/Base';
import PVCardBack from '@components/Base/PVCard/PVCardBack';
import PVCardBackBody from '@components/Base/PVCard/PVCardBackBody';

type UnclaimedCardProps<
    P = {
        asset: UnclaimedCoinAsset;
    },
> = P;

export const UnclaimedCardContainer: React.FC<UnclaimedCardProps> = (props) => {
    const { asset } = props;
    const imageUrl = asset.imageSmall || asset.image;
    const imageAlt = asset.name;
    const tokenId = asset.tokenId;
    const name = asset.name;
    const coinId = asset.attributes.find((a) => a.traitType === 'Coin')?.value;
    const description = asset.contract.description;
    const address = asset.contract.address;
    const unclaimedCardId =
        asset.name.toLowerCase().replace(/[:\s\-#]+/gm, '-') +
        '-' +
        asset.tokenId;

    const navOpenSea = (contract: string, tokenId: string) => {
        let openSeaLink = `https://opensea.io/assets/ethereum/${contract}/${tokenId}`;
        window.open(openSeaLink, '_blank');
    };

    const navCoinbase = (contract: string, tokenId: string) => {
        let coinbaseLink = `https://nft.coinbase.com/nft/ethereum/${contract}/${tokenId}`;
        window.open(coinbaseLink, '_blank');
    };

    return (
        <PVCard id={unclaimedCardId} type={'assets'}>
            <PVCardFront id={'unclaimed-front'}>
                <img src={imageUrl} alt={imageAlt} />
            </PVCardFront>
            <PVCardBack id={'unclaimed-back'}>
                <PVCardBackHeader id={'unclaimed-back-header'}>
                    <p className={'tokenId'}>Token No. {tokenId}</p>
                    <p className={'name'}>{name}</p>
                </PVCardBackHeader>
                <PVCardBackBody id={'unclaimed-back-body'}>
                    <PVCardButton
                        id={'open-sea-button'}
                        handleOnClick={() => navOpenSea(address, tokenId)}
                    >
                        <img src={OpenSeaLogo} alt={'OpenSea'} />
                    </PVCardButton>
                    <PVCardButton
                        id={'coinbase-button'}
                        handleOnClick={() => navCoinbase(address, tokenId)}
                    >
                        <img src={CoinbaseLogo} alt={'Coinbase'} />
                        <span>Coinbase</span>
                    </PVCardButton>
                </PVCardBackBody>
                <PVCardBackFooter id={'unclaimed-back-footer'}>
                    <p className={'coinId'}>{'Coin ID: ' + coinId}</p>
                    <p className={'contractName'}>{description}</p>
                </PVCardBackFooter>
            </PVCardBack>
        </PVCard>
    );
};
