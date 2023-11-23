import tw from 'twin.macro';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

type PVCardBackProps<
    P = {
        children: ReactNode;
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
    },
> = P;

export const PVCardBack: FC<PVCardBackProps> = (props) => {
    const { children, id, className } = props;
    return (
        <PVCardBackStyled id={id} className={className}>
            <PVCardWrapper>
                <PVCardBackContent>{children}</PVCardBackContent>
            </PVCardWrapper>
        </PVCardBackStyled>
    );
};

const PVCardBackStyled = styled.div`
    transform: rotateY(180deg);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;

    ${tw`absolute h-full w-full bg-white/75 text-black text-xs p-2 flex flex-col justify-between`}
    & > img {
        transform: rotateY(180deg);
        ${tw`w-full h-full opacity-25`}
    }
`;

const PVCardWrapper = styled.div`
    ${tw`h-full w-full flex flex-col items-center absolute inset-0 p-2`}
`;

const PVCardBackContent = styled.div`
    ${tw`h-full w-full relative flex items-center justify-center flex-col`}
`;

export default PVCardBack;
