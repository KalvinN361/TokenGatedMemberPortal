import tw from 'twin.macro';
import { FC, ReactNode } from 'react';
import styled from 'styled-components';

type PVCardBackBodyProps<
    P = {
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
        children?: ReactNode;
    },
> = P;

export const PVCardBackBody: FC<PVCardBackBodyProps> = (props) => {
    const { children, id, className } = props;
    return (
        <PVCardBackBodyStyled id="id" className={className}>
            {children}
        </PVCardBackBodyStyled>
    );
};

const PVCardBackBodyStyled = styled.div`
    ${tw`flex flex-col justify-center items-center`}
    & > .link {
        ${tw`bg-blue-400 text-white p-2 text-base drop-shadow-lg w-full cursor-pointer flex flex-row justify-center items-center gap-2`}
        &:first-child {
            ${tw`mb-2`}
        }

        & > img {
            ${tw`h-6 inline-block mr-2`}
        }

        & > span {
            ${tw`font-bold`}
        }
    }
`;

export default PVCardBackBody;
