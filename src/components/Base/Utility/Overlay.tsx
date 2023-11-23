import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

type PVPageOverlayProps<
    P = {
        children?: ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
        color: 'white' | 'black';
    },
> = P;
export const Overlay: FC<PVPageOverlayProps> = (props) => {
    const { className, id, children, color } = props;
    return (
        <PVPageOverlayStyled className={`${className} ${color}`} id={id}>
            {children}
        </PVPageOverlayStyled>
    );
};

export const PVPageOverlayStyled = styled.div`
    ${tw`absolute top-0 left-0 right-0 bottom-0 z-10`}
    &.white {
        ${tw`bg-white/50`}
    }

    &.black {
        ${tw`bg-black/50`}
    }
`;

export default Overlay;
