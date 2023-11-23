import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

type PVBodyProps<
    P = {
        children?: ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
    },
> = P;
export const PVBody: FC<PVBodyProps> = (props) => {
    const { children, className, id } = props;
    return (
        <PVBodyStyled className={className} id={id}>
            {children}
        </PVBodyStyled>
    );
};

export const PVBodyStyled = styled.div`
    ${tw`w-full relative flex flex-col items-center text-white h-9/10 z-50`}
`;

export default PVBody;
