import tw from 'twin.macro';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

type PVCardBackHeaderProps<
    P = {
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
        children?: ReactNode;
    },
> = P;

export const PVCardBackHeader: FC<PVCardBackHeaderProps> = (props) => {
    const { children, id, className } = props;
    return (
        <PVCardBackHeaderStyled id="id" className={className}>
            {children}
        </PVCardBackHeaderStyled>
    );
};

const PVCardBackHeaderStyled = styled.div`
    ${tw`absolute top-0 left-0 w-full flex flex-col items-center`}
    & > .tokenId {
        ${tw`w-full mt-1`}
    }

    & > .name {
        ${tw`font-bold text-sm px-1 leading-4`}
    }
`;

export default PVCardBackHeader;
