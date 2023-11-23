import { FC, ReactNode } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';

type PVCardProps<
    P = {
        children: ReactNode;
        className?: HTMLDivElement['className'];
        type: 'assets' | 'gallery';
        id: string;
    },
> = P;
export const PVCard: FC<PVCardProps> = (props) => {
    const { children, id, className, type } = props;
    return (
        <PVCardWrapper
            id={`card-wrapper-${id}`}
            className={className! + ` ${type}`}
        >
            <PVCardStyled id={`card-${id}`} className={className!}>
                {children}
            </PVCardStyled>
        </PVCardWrapper>
    );
};

export const PVCardWrapper = styled.div`
    perspective: 1000px;

    ${tw`bg-transparent`}
    &:hover > div {
        transform: rotateY(180deg);
    }

    &.assets {
        ${tw`
            h-36 md:h-60
            w-40 md:w-full
        `}
    }

    &.gallery {
        ${tw`
            w-36 md:w-48
            h-full md:h-48`}
        & > div {
            ${tw`w-auto max-h-full`}
            &:hover {
                transform: rotateY(0deg);
            }
        }
    }
`;

export const PVCardStyled = styled.div`
  transform-style: preserve-3d;
  transition: transform 1s;

  ${tw`relative h-full w-auto text-center rounded-md border-8 border-white border-solid flex items-center justify-center bg-black`}
  &.gallery {
    ${tw`border-4!`}
  }
  
}
`;
export default PVCard;
