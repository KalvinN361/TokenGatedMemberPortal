import { FC, ReactNode } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';

type PVCardBackButtonProps<
    P = {
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
        children?: ReactNode;
        handleOnClick?: () => void;
    },
> = P;

export const PVCardButton: FC<PVCardBackButtonProps> = (props) => {
    const { children, id, className, handleOnClick } = props;
    return (
        <PVCardBackButtonStyled
            id={id}
            className={className}
            onClick={handleOnClick}
        >
            {children}
        </PVCardBackButtonStyled>
    );
};

const PVCardBackButtonStyled = styled.div`
    ${tw`bg-blue-400 text-white p-2 text-base drop-shadow-lg w-full cursor-pointer flex flex-row justify-center items-center gap-2`}
    &:first-child {
        ${tw`mb-2`}
    }

    & > img {
        ${tw`h-6 inline-block mr-1`}
    }

    & > span {
        ${tw`font-bold`}
    }
`;

export default PVCardButton;
