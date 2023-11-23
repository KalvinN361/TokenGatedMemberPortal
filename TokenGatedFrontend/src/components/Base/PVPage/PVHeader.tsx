import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

type PVHeaderProps<
    P = {
        children?: ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
    },
> = P;
export const PVHeader: FC<PVHeaderProps> = (props) => {
    const { children, className, id } = props;
    return (
        <PVHeaderStyled className={className} id={id}>
            {children}
        </PVHeaderStyled>
    );
};

export const PVHeaderStyled = styled.div`
    ${tw`relative w-full text-center h-[5%] z-60 flex flex-col items-center justify-center`}
    & > h1 {
        ${tw`w-full relative p-4 font-sans font-bold text-gold text-base md:text-[24px] tracking-[.2px]`}
    }
`;

export default PVHeader;
