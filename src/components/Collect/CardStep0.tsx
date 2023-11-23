import React from 'react';
import { CardStep0Props } from '@definitions/Collect';
import {
    CollectButton,
    CollectButtonContainer,
    CollectCard,
    CollectQuestion,
} from '@styles/Collect.styled';

export const CardStep0: React.FC<CardStep0Props> = (props) => {
    const { handleStepClick, email, referral } = props;

    return (
        <CollectCard>
            {email && (
                <CollectQuestion>
                    <p>Looks like you got here from an email</p>
                    <p className={'email'}>{`${email}`}</p>
                    <p>How would you like to claim your gift?</p>
                    <p>e-mail or wallet?</p>
                </CollectQuestion>
            )}
            {referral && (
                <CollectQuestion>
                    <p>Looks like you were referred by: </p>
                    <p className={'referral'}>{`${referral}`}</p>
                    <p>How would you like to claim your gift?</p>
                    <p>e-mail or wallet?</p>
                </CollectQuestion>
            )}
            {!referral && !email && (
                <CollectQuestion>
                    <p>How would you like to claim your gift?</p>
                    <p>e-mail or wallet?</p>
                </CollectQuestion>
            )}
            <CollectButtonContainer>
                <CollectButton
                    className={'yes'}
                    value={3}
                    onClick={handleStepClick}
                >
                    EMAIL
                </CollectButton>
                <CollectButton
                    className={'no'}
                    value={2}
                    onClick={handleStepClick}
                >
                    WALLET
                </CollectButton>
            </CollectButtonContainer>
        </CollectCard>
    );
};
