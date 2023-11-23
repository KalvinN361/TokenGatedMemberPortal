import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

type PVFooterProps<
    P = {
        children?: ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
    },
> = P;
export const PVFooter: FC<PVFooterProps> = (props) => {
    const { children, className, id } = props;
    return (
        <PVFooterStyled className={className} id={id}>
            {children}
        </PVFooterStyled>
    );
};

export const PVFooterStyled = styled.div`
    ${tw`fixed md:max-w-[768px] xl:max-w-[1280px] 3xl:max-w-[1920px] bottom-0 w-full h-[5%] flex flex-col items-center justify-center bg-black/50 z-50`}
`;

export default PVFooter;
