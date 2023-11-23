import tw from 'twin.macro';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

type PVCardFrontProps<
    P = {
        children: ReactNode;
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
    },
> = P;

export const PVCardFront: FC<PVCardFrontProps> = (props) => {
    const { children, id, className } = props;
    return (
        <PVCardFrontStyled id={id} className={className}>
            {children}
        </PVCardFrontStyled>
    );
};

const PVCardFrontStyled = styled.div`
    ${tw`h-full w-auto absolute flex flex-col items-center justify-center`}
    & > video {
        ${tw`h-full w-auto object-contain object-center bg-black justify-center`}
    }

    &.placeholder {
        ${tw`relative bg-black flex items-center justify-between`}
        > div {
            ${tw`w-full h-full text-sm absolute flex flex-col items-center justify-start`}
        }

        > img {
            ${tw`w-full h-full object-contain object-center scale-75`}
        }
    }

    & > img {
        ${tw`max-h-full w-auto`}
    }
`;

export default PVCardFront;
