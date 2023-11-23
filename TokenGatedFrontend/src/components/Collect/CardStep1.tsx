import React from 'react';
import { CardStep1Props } from '@definitions/Collect';
import {
    CollectButton,
    CollectButtonContainer,
    CollectCard,
    CollectQuestion,
} from '@styles/Collect.styled';

export const CardStep1: React.FC<CardStep1Props> = (props) => {
    const { handleStepClick } = props;

    return (
        <CollectCard>
            <CollectQuestion>
                <p>Do you have Wallet Address?</p>
            </CollectQuestion>
            <CollectButtonContainer>
                <CollectButton
                    className={'yes'}
                    value={1}
                    onClick={handleStepClick}
                >
                    YES
                </CollectButton>
                <CollectButton
                    className={'no'}
                    value={2}
                    onClick={handleStepClick}
                >
                    NO
                </CollectButton>
            </CollectButtonContainer>
        </CollectCard>
    );
};
