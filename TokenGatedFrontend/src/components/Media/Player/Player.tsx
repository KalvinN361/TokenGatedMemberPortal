import React from 'react';
import { Media as MediaType } from '@definitions/index';
import { PVGridContainer } from '@components/Base';
import {
    MediaPlayerCloseButton,
    MediaPlayerModal,
    MediaPlayerModalContainer,
    PlayerCardContainer,
} from '@components/Media';
import styled from 'styled-components';
import tw from 'twin.macro';

type MediaPlayerImageProps<
    P = {
        assetsByCategory: {
            [category: string]: MediaType[];
        };
        currentCategory: string;
        setCurrentMedia: React.Dispatch<React.SetStateAction<string>>;
        currentMedia: string;
        setCurrentName: React.Dispatch<React.SetStateAction<string>>;
        currentName: string;
        setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
        isPopupOpen: boolean;
    },
> = P;

export const Player: React.FC<MediaPlayerImageProps> = (props) => {
    const {
        assetsByCategory,
        currentCategory,
        setCurrentMedia,
        currentMedia,
        setCurrentName,
        currentName,
        setIsPopupOpen,
        isPopupOpen,
    } = props;

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };

    return (
        <PlayerContainer id={'media-player-video-container'}>
            <PVGridContainer id={'player-grid'} columns={4}>
                {assetsByCategory[currentCategory]?.map((asset, index) => (
                    <PlayerCardContainer
                        id={`video-${asset.name.replace(/[:\s\-#/"]+/gm, '-')}`}
                        asset={asset}
                        setOpenPlayerModal={openPopup}
                        setCurrentMedia={setCurrentMedia}
                        setCurrentName={setCurrentName}
                    />
                ))}
            </PVGridContainer>
            {isPopupOpen && (
                <MediaPlayerModal id={'media-player-image-popup'}>
                    <MediaPlayerModalContainer id={'media-player-container'}>
                        <MediaPlayer key={0} id="media-player">
                            {currentMedia && (
                                <VideoPlayer
                                    autoPlay={true}
                                    controls={true}
                                    src={currentMedia}
                                    poster={currentMedia}
                                />
                            )}
                            <div className="text-center text-gold font-bold">
                                <span>{currentName}</span>
                            </div>
                        </MediaPlayer>
                    </MediaPlayerModalContainer>
                    <MediaPlayerCloseButton
                        id={'media-player-close-button'}
                        onClose={closePopup}
                    />
                </MediaPlayerModal>
            )}
        </PlayerContainer>
    );
};

const PlayerContainer = styled.div`
    ${tw`flex flex-wrap overflow-auto w-full h-full max-h-full`}
    > div {
        ${tw`w-full p-4 flex flex-col items-center`}
        > img {
            ${tw`cursor-pointer max-h-full w-fit`}
        }
    }
`;

const MediaPlayer = styled.div`
    ${tw`
		h-[80%] w-full
		flex flex-col justify-center items-center 
	`}
`;

const VideoPlayer = styled.video`
    ${tw`w-full`}
`;
export default Player;
