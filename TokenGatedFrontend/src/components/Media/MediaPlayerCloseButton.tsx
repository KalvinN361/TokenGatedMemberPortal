import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { AiOutlineCloseCircle } from 'react-icons/ai';

type MediaPlayerCloseButtonProps<
    P = {
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
        onClose: () => void;
    },
> = P;

export const MediaPlayerCloseButton: FC<MediaPlayerCloseButtonProps> = (
    props
) => {
    const { id, className, onClose } = props;
    return (
        <MediaPlayerPopupCloseBtnStyled
            id={'media-player-image-popup'}
            onClick={onClose}
        >
            <AiOutlineCloseCircle className={'text-white'} />
        </MediaPlayerPopupCloseBtnStyled>
    );
};

const MediaPlayerPopupCloseBtnStyled = styled.button`
    ${tw`absolute text-xl top-0 right-0 -translate-x-2 translate-y-2 p-2 text-white bg-gray-800/50 focus:outline-none z-100`}
`;
export default MediaPlayerCloseButton;
