import tw from 'twin.macro';
import { FC } from 'react';
import styled from 'styled-components';

type PVModalHeaderProps<
    P = {
        children?: React.ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
    },
> = P;

export const PVModalHeader: FC<PVModalHeaderProps> = (props) => {
    const { className, id, children } = props;
    return (
        <PVModalHeaderStyled className={className} id={id}>
            {children}
        </PVModalHeaderStyled>
    );
};

const PVModalHeaderStyled = styled.div`
    ${tw`w-full flex justify-center items-center h-[10%] bg-gray-800`}
    & > h1 {
        ${tw`text-xs md:text-2xl text-white font-bold`}
    }
`;

export default PVModalHeader;
