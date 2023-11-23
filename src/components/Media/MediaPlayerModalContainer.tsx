import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

type MediaPlayerModalContainerProps<
    P = {
        children: ReactNode;
        id: HTMLDivElement['id'];
        className?: HTMLDivElement['className'];
    },
> = P;

export const MediaPlayerModalContainer: FC<MediaPlayerModalContainerProps> = (
    props
) => {
    const { children } = props;
    return (
        <MediaPlayerModalContainerStyled id={'media-player-image-popup'}>
            {children}
        </MediaPlayerModalContainerStyled>
    );
};

const MediaPlayerModalContainerStyled = styled.div`
    ${tw`relative w-full h-full flex flex-col justify-center items-center`}
    & > img {
        ${tw`max-h-full max-w-full`}
    }
`;

export default MediaPlayerModalContainer;
