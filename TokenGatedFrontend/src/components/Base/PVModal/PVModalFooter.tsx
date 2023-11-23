import tw from 'twin.macro';
import { FC } from 'react';
import styled from 'styled-components';

type PVModalFooterProps<
    P = {
        children?: React.ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
    },
> = P;

export const PVModalFooter: FC<PVModalFooterProps> = (props) => {
    const { className, id, children } = props;
    return (
        <PVModalFooterStyled className={className} id={id}>
            {children}
        </PVModalFooterStyled>
    );
};

const PVModalFooterStyled = styled.div`
    ${tw`w-full flex justify-center items-center h-[10%] bg-gray-800`}
`;

export default PVModalFooter;
