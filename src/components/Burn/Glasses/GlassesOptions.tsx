import React, { useEffect } from 'react';
import { OptionComingSoon } from '@components/Burn';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { setOptionSelected } from '@state/features';
import { OptionUpgrade } from '@components/Burn/Glasses/Upgrade/OptionUpgrade';
import { OptionUpgradeSelected } from '@components/Burn/Glasses/Upgrade/OptionUpgradeSelected';
import styled from 'styled-components';
import tw from 'twin.macro';

type GlassesOptionProps<P = {}> = P;

export const GlassesOptions: React.FC<GlassesOptionProps> = (props) => {
    const {
        /*selectedBill, setSelectedBill*/
    } = props;
    const dispatch = useDispatch();
    const burn = useSelector((state: RootState) => state.burn);

    useEffect(() => {
        if (burn.optionSelected) dispatch(setOptionSelected(''));
    }, []);

    return (
        <GlassesOptionsWrapper className="3d-options-wrapper">
            {burn.optionSelected === '' && (
                <GlassesOptionsContainer id={'3d-options'}>
                    <OptionUpgrade />
                    <OptionComingSoon />
                </GlassesOptionsContainer>
            )}
            {burn.optionSelected === 'upgrade' && <OptionUpgradeSelected />}
        </GlassesOptionsWrapper>
    );
};

export const GlassesOptionsWrapper = styled.div`
    ${tw`w-full h-full flex flex-col md:flex-row relative`}
`;

export const GlassesOptionsContainer = styled.div`
    ${tw`flex flex-col md:flex-row w-full h-full`}
    & > div:first-child {
        ${tw`border-b md:border-r border-solid border-gray-200`}
    }
`;
