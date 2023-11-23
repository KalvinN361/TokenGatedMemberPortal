import React from 'react';
import {
    BurnOptionImageContainer,
    BurnOptionDescriptionContainer,
} from '@styles/index';
import { useDispatch } from 'react-redux';
import { setOptionSelected } from '@state/features';
import { BurnOption } from '@components/Burn/BurnOption';

type OptionComingSoonProps<P = {}> = P;

export const OptionComingSoon: React.FC<OptionComingSoonProps> = (props) => {
    const {} = props;
    const dispatch = useDispatch();

    const handleOptionSelect = (option: 'burnandturn' | 'upgrade' | '') => {
        dispatch(setOptionSelected(option));
    };

    return (
        <BurnOption id={'coming-soon-option'} optionSelected={''}>
            <BurnOptionImageContainer>
                <div className={'text-3xl font-bold'}>
                    <span>COMING SOON</span>
                </div>
            </BurnOptionImageContainer>
            <BurnOptionDescriptionContainer>
                <div>
                    <h2>{'YES! There is more'}</h2>
                    <p>
                        {
                            'This is currently in development. We will be adding more options to burn your 3-D Glasses into. Stay tuned for more updates!'
                        }
                    </p>
                </div>
            </BurnOptionDescriptionContainer>
        </BurnOption>
    );
};
