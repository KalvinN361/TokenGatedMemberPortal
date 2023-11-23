import { FC, ReactNode } from 'react';
import tw from 'twin.macro';
import styled from 'styled-components';
import { Overlay } from '@components/Base';

type PVModalProps<
    P = {
        children?: ReactNode;
        className?: HTMLDivElement['className'];
        id: HTMLDivElement['id'];
        openModal: boolean;
    },
> = P;
export const PVModal: FC<PVModalProps> = (props) => {
    const { children, className, id, openModal } = props;
    return (
        <PVModalStyled className={className} id={id} hidden={openModal}>
            <Overlay id={'modal-overlay'} color={'black'} />
            <PVModalContent>{children}</PVModalContent>
        </PVModalStyled>
    );
};

const PVModalStyled = styled.div`
    ${tw`fixed top-0 left-0 w-full h-full flex justify-center items-end md:items-center bg-black/50 z-50`}
`;

const PVModalContent = styled.div`
    ${tw`relative w-full max-w-7xl h-[90%] md:h-3/5 flex flex-col justify-center items-center bg-gray-300 border-white border-8 border-solid z-20 rounded-md`}
`;

export default PVModal;
