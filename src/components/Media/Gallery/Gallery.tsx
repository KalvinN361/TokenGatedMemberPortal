import React from 'react';
import { Media as MediaType } from '@definitions/index';
import { PVGridContainer } from '@components/Base';
import {
    GalleryCardContainer,
    MediaPlayerCloseButton,
    MediaPlayerModal,
    MediaPlayerModalContainer,
} from '@components/Media';
import styled from 'styled-components';
import tw from 'twin.macro';

type MediaImageProps<
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

export const Gallery: React.FC<MediaImageProps> = (props) => {
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
        <GalleryContainer id={'gallery-container'}>
            <PVGridContainer id={'gallery-grid'} columns={6}>
                {assetsByCategory[currentCategory]?.map((asset, i) => (
                    <GalleryCardContainer
                        key={i}
                        id={`image-${asset.name.replace(/[:\s\-#/"]+/gm, '')}`}
                        asset={asset}
                        setOpenGalleryModal={openPopup}
                        setCurrentMedia={setCurrentMedia}
                        setCurrentName={setCurrentName}
                    />
                ))}
            </PVGridContainer>
            {isPopupOpen && (
                <MediaPlayerModal id={'media-player-image-popup'}>
                    <MediaPlayerModalContainer
                        id={'media-player-content-container'}
                    >
                        <img
                            className={
                                'border-8 border-white border-solid rounded-lg'
                            }
                            src={currentMedia}
                            alt={currentName}
                        />
                        <div className="text-center text-gold font-bold">
                            <span>{`${currentName.toString()}`}</span>
                        </div>
                    </MediaPlayerModalContainer>
                    <MediaPlayerCloseButton
                        id={'media-player-close-button'}
                        onClose={closePopup}
                    />
                </MediaPlayerModal>
            )}
        </GalleryContainer>
    );
};

const GalleryContainer = styled.div`
    ${tw`flex flex-wrap w-full justify-center max-h-9/10`}
`;

export default Gallery;
