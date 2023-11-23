import styled from 'styled-components';
import tw from 'twin.macro';
import { FC, ReactNode } from 'react';

type SelectedProps<
    P = {
        children?: ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
    },
> = P;

export const Selected: FC<SelectedProps> = (props) => {
    const { children, id, className } = props;
    return (
        <SelectedStyled id={id} className={className}>
            {children}
        </SelectedStyled>
    );
};

const SelectedStyled = styled.div`
    ${tw`relative h-full w-full flex flex-col items-center justify-center`}
    > img {
        ${tw`h-full w-full max-h-[300px] md:max-h-[340px] max-w-[440px] object-contain`}
    }

    > div {
        ${tw`text-white text-sm bg-black/50 absolute bottom-0 p-2`}
        > p {
            ${tw``}
        }
    }
`;
