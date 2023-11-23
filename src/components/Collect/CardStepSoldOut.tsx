import React from 'react';
import { CardStepSoldOutProps } from '@definitions/Collect';
import { CollectCard, CollectQuestion } from '@styles/Collect.styled';

export const CardStepSoldOut: React.FC<CardStepSoldOutProps> = (props) => {
    const {} = props;

    return (
        <CollectCard>
            <CollectQuestion>
                <p>
                    We have given away all the freebies! and we have minted out!
                    You still can we can still get you a Bill Murray NFT! Just
                    go the OpenSea link below!
                </p>
                <a
                    href={
                        'https://opensea.io/collection/bill-murray-1000-open-edition'
                    }
                >
                    Bill Murray 1000: Open Edition
                </a>
            </CollectQuestion>
        </CollectCard>
    );
};
