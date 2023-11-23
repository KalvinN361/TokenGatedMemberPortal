import { FC, ReactNode } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';

type PVModalButtonProps<
    P = {
        children?: ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
        disabled?: boolean;
        handle: () => void;
    },
> = P;
export const PVModalButton: FC<PVModalButtonProps> = (props) => {
    const { className, id, children, handle, disabled = false } = props;
    return (
        <PVModalButtonContainer className={className} id={id}>
            <button id={`${id}-button`} onClick={handle} disabled={disabled}>
                {children}
            </button>
        </PVModalButtonContainer>
    );
};

export const PVModalButtonContainer = styled.div`
    ${tw`flex justify-center items-center font-bold text-white w-1/2 h-full`}
    &:only-child {
        ${tw`w-full`}
    }

    &:first-child {
        ${tw`border-r border-gray-500 border-solid`}
    }

    & > button {
        ${tw`w-full h-full`}
        &:hover {
            ${tw`text-gold`}
        }
    }
`;
