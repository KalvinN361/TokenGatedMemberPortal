import React from 'react';
import {
    PVCard,
    PVCardBackHeader,
    PVCardButton,
    PVCardFront,
} from '@components/Base';
import { Asset, ClaimCardProps, Contract } from '@definitions/index';
import { FaCoins } from 'react-icons/fa';
import PVCardBack from '@components/Base/PVCard/PVCardBack';
import PVCardBackBody from '@components/Base/PVCard/PVCardBackBody';
import PVCardBackFooter from '@components/Base/PVCard/PVCardBackFooter';
import styled from 'styled-components';
import tw from 'twin.macro';

export const ClaimCardContainer: React.FC<ClaimCardProps> = (props) => {
    const { claim } = props;

    return (
        <PVCard id={'claim-' + claim.id} type={'assets'}>
            <PVCardFront id={'claim-front'}>
                {claim.claimed && (
                    <ClaimedContentCover>
                        <span>{'Claimed'}</span>
                    </ClaimedContentCover>
                )}
                <img src={claim.image} alt={'coin-gif'} />
            </PVCardFront>
            <PVCardBack id={'claim-back'}>
                <PVCardBackHeader id={'claim-back-header'}>
                    <p className={'tokenId'}>Coin No. {claim.tokenId}</p>
                    <p className={'name'}>{claim.name}</p>
                </PVCardBackHeader>
                <PVCardBackBody id={'claim-back-body'}>
                    <PVCardButton id={'claim-button'}>
                        <FaCoins className={'icon'} />
                        {!claim.claimed ? (
                            <a href={claim.url} target={'_blank'}>
                                {`Claim`}
                            </a>
                        ) : (
                            <span>{`Coin Claimed`}</span>
                        )}
                    </PVCardButton>
                </PVCardBackBody>
                <PVCardBackFooter id={'claim-back-footer'}>
                    <p
                        id={'asset-name'}
                    >{`${claim.asset.name} (${claim.asset.tokenId})`}</p>
                    <p id={'contract-name'}>
                        {claim.asset.contract.description}
                    </p>
                </PVCardBackFooter>
            </PVCardBack>
        </PVCard>
    );
};

const ClaimedContentCover = styled.div`
    ${tw`absolute top-0 left-0 bottom-0 right-0 bg-black/50 flex justify-center items-center`}
    > span {
        ${tw`-rotate-45 font-bold text-gold/50 text-4xl md:text-6xl`}
    }
`;

export default ClaimCardContainer;
