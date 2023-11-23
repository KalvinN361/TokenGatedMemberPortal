import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

type MediaPlayerModalProps<
    P = {
        children: ReactNode;
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
    },
> = P;

export const MediaPlayerModal: FC<MediaPlayerModalProps> = (props) => {
    const { children } = props;
    return (
        <MediaPlayerModalStyled id={'media-player-image-popup'}>
            <MediaPlayerModalContent id={'media-player-popup-content'}>
                {children}
            </MediaPlayerModalContent>
        </MediaPlayerModalStyled>
    );
};

const MediaPlayerModalStyled = styled.div`
    ${tw`absolute w-full! p-4 inset-0 z-100 flex items-center justify-center bg-black/75`}
`;
const MediaPlayerModalContent = styled.div`
    ${tw`relative w-full md:w-3/4`}
`;

export default MediaPlayerModal;
