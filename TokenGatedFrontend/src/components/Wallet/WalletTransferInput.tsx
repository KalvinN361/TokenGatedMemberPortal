import tw from 'twin.macro';
import React, { FC } from 'react';
import styled from 'styled-components';
import { FaWallet } from 'react-icons/fa';

type WalletInputProps<
    P = {
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
        handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
        error: 'empty' | 'error' | 'valid';
    },
> = P;

export const WalletTransferInput: FC<WalletInputProps> = (props) => {
    const { className, id, handleOnChange, error } = props;
    return (
        <WalletInputWrapper className={className} id={id}>
            <WalletInputLabel htmlFor="wallet" id={'wallet-input-label'}>
                Enter Wallet Address to Transfer to
            </WalletInputLabel>
            <WalletInputContainer id={'wallet-input-container'}>
                <WalletInputIconContainer id={'wallet-input-icon-container'}>
                    <WalletIcon />
                </WalletInputIconContainer>
                <WalletInputStyled
                    type="text"
                    name="wallet"
                    id="wallet"
                    className={error}
                    onChange={handleOnChange}
                    placeholder="Wallet Address"
                />
            </WalletInputContainer>
        </WalletInputWrapper>
    );
};

const WalletInputWrapper = styled.div`
    ${tw`w-full flex flex-col`}
`;

const WalletInputLabel = styled.label`
    ${tw`block text-sm font-medium leading-6 text-gray-900`}
`;
const WalletInputContainer = styled.div`
    ${tw`relative rounded-md shadow-sm mb-2`}
`;

const WalletInputIconContainer = styled.div`
    ${tw`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3`}
`;

const WalletInputStyled = styled.input`
    ${tw`block w-full rounded-md border-0 py-1.5 pl-10 ring-2 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-xs sm:leading-6`}
    &.empty {
        ${tw`text-gray-900 ring-gray-300`}
    }

    &.error {
        ${tw`text-red-600  ring-red-300`}
    }

    &.valid {
        ${tw`text-green-600 ring-green-300`}
    }
`;

const WalletIcon = styled(FaWallet)`
    ${tw`text-gray-400`};
`;
export default WalletTransferInput;
