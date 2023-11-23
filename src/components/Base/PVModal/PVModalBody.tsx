import tw from 'twin.macro';
import { FC } from 'react';
import styled from 'styled-components';

type PVModalBodyProps<
    P = {
        children?: React.ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
    },
> = P;

export const PVModalBody: FC<PVModalBodyProps> = (props) => {
    const { className, id, children } = props;
    return (
        <PVModalBodyStyled className={className} id={id}>
            {children}
        </PVModalBodyStyled>
    );
};

const PVModalBodyStyled = styled.div`
    ${tw`w-full flex flex-col md:flex-row justify-center items-center md:items-start h-[80%] overflow-auto relative z-60`}
`;

export default PVModalBody;
