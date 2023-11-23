import tw from 'twin.macro';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

type PVCardBackFooterProps<
    P = {
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
        children?: ReactNode;
    },
> = P;

export const PVCardBackFooter: FC<PVCardBackFooterProps> = (props) => {
    const { children, id, className } = props;
    return (
        <PVCardBackFooterStyled id="id" className={className}>
            {children}
        </PVCardBackFooterStyled>
    );
};

const PVCardBackFooterStyled = styled.div`
    ${tw`w-full absolute bottom-0 flex flex-col justify-center items-center`}
    & > .coinId {
        ${tw`text-base text-blue-700 font-bold`}
    }

    & > .contractName {
        ${tw`bottom-0 flex justify-center w-full font-bold`}
    }
`;

export default PVCardBackFooter;
