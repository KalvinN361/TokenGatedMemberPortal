import styled from 'styled-components';
import tw from 'twin.macro';
import { FC, ReactNode } from 'react';

type BurnOptionDescriptionProps<
    P = {
        children?: ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
    },
> = P;

export const BurnOptionDescriptionContainer: FC<BurnOptionDescriptionProps> = (
    props
) => {
    const { children, className, id } = props;
    return (
        <BurnOptionDescriptionContainerStyled className={className} id={id}>
            {children}
        </BurnOptionDescriptionContainerStyled>
    );
};

const BurnOptionDescriptionContainerStyled = styled.div`
    ${tw` w-full h-2/3 md:h-2/5 p-4 flex flex-col md:flex-row md:items-start justify-start md:justify-center`}
`;
