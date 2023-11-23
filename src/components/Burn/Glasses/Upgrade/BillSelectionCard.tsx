import { Asset } from '@definitions/Asset';
import React, { FC } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

type BillSelectionCardProps<
    P = {
        asset: Asset;
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
        handleImageClick: (asset: Asset) => void;
    },
> = P;

export const BillSelectionCard: FC<BillSelectionCardProps> = (props) => {
    const { asset, id, className, handleImageClick } = props;

    return (
        <BillSelectionCardStyled id={id} className={className}>
            <BillSelectionCardImage
                src={asset.imageSmall || asset.image}
                alt={asset.name}
                onClick={() => handleImageClick(asset)}
            />
            <BillSelectionCardName>
                <p>{`${asset.name} - Token ID: ${asset.tokenId}`}</p>
            </BillSelectionCardName>
        </BillSelectionCardStyled>
    );
};

const BillSelectionCardStyled = styled.div`
    ${tw`relative hover:border-green-500 border-8 border-solid cursor-pointer border-white rounded-lg`}
`;

const BillSelectionCardImage = styled.img`
    ${tw`max-w-full h-auto hover:opacity-50 hover:border-4 border-solid`}
`;

const BillSelectionCardName = styled.div`
    ${tw`text-white text-sm bg-black/50 absolute bottom-0 w-full p-2`}
    > p {
        ${tw``}
    }
`;

export default BillSelectionCard;
