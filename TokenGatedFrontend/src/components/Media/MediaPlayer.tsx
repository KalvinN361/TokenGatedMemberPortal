import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Media as MediaType,
    Media,
    MediaPlayerProps,
} from '@definitions/index';
import { RootState } from '@state/index';
import { Player, Gallery } from '@components/Media';
import { getMediaCategories } from '@libs/utils';
import { Api } from '@libs/API';
import { Spinner } from '@components/Base';
import { setMediaItems } from '@state/index';
import styled from 'styled-components';
import tw from 'twin.macro';

export const MediaPlayer: React.FC<MediaPlayerProps> = (props) => {
    const { mediaType, assetIds } = props;
    const dispatch = useDispatch();
    const assets = useSelector((state: RootState) => state.assets);
    const media = useSelector((state: RootState) => state.media);
    const [activeMedia, setActiveMedia] = useState<Array<Media>>([]);
    const [currentMedia, setCurrentMedia] = useState<string>('');
    const [currentName, setCurrentName] = useState<string>('');
    const [mediaByCategory, setMediaByCategory] = useState<{
        [category: string]: Array<Media>;
    }>({});
    const [currentCategory, setCurrentCategory] = useState<string>('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        if (!assetIds || assetIds.length < 1) return;

        (async () => {
            let allMedia = await Api.media.getAllByAssetsAndType(
                assetIds,
                mediaType
            );
            if (assets.ocean) {
                let ocMedia = (
                    (await Api.media.getAllByCategories([
                        'Oceanside',
                    ])) as Array<MediaType>
                ).filter((media) => media.type === mediaType);
                allMedia = [...allMedia, ...ocMedia];
            }
            dispatch(setMediaItems(allMedia as Array<Media>));
        })();
    }, [assetIds]);

    useEffect(() => {
        if (!media.items.length) return;
        setCurrentMedia(media.items[0].url);
        setCurrentName(media.items[0].name);
        setActiveMedia(media.items);
    }, [media.items]);

    useEffect(() => {
        const mediaByCategories = getMediaCategories(activeMedia);
        setMediaByCategory(mediaByCategories);
        const categories = Object.keys(mediaByCategories);
        if (categories.length > 0) {
            setCurrentCategory(categories[0]);
        }
    }, [activeMedia]);

    const handleCategoryClick = (category: string) => {
        const assets = mediaByCategory[category];
        setCurrentCategory(category);
        if (assets && assets.length) {
            setCurrentMedia(assets[0].url);
            setCurrentName(assets[0].name);
        }
    };

    return (
        <MediaPlayerContainer id="media-player-container">
            {media.items.length ? (
                <MediaPlayerTypeMenu id={'media-player-type-menu'}>
                    {Object.keys(mediaByCategory).map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`${
                                currentCategory === category
                                    ? 'bg-transparent'
                                    : ''
                            }`}
                            style={{
                                color:
                                    currentCategory === category
                                        ? 'gold'
                                        : 'white',
                            }}
                        >
                            <span>{category}</span>
                        </button>
                    ))}
                </MediaPlayerTypeMenu>
            ) : (
                <div
                    className={
                        'absolute h-[500px] w-3/4 flex items-center justify-center'
                    }
                >
                    <Spinner
                        hidden={false}
                        background={false}
                        absolute={true}
                    />
                </div>
            )}

            {mediaType === 'image' ? (
                <Gallery
                    assetsByCategory={mediaByCategory}
                    currentCategory={currentCategory}
                    setCurrentMedia={setCurrentMedia}
                    currentMedia={currentMedia}
                    setCurrentName={setCurrentName}
                    currentName={currentName}
                    setIsPopupOpen={setIsPopupOpen}
                    isPopupOpen={isPopupOpen}
                />
            ) : (
                <Player
                    assetsByCategory={mediaByCategory}
                    currentCategory={currentCategory}
                    setCurrentMedia={setCurrentMedia}
                    currentMedia={currentMedia}
                    setCurrentName={setCurrentName}
                    currentName={currentName}
                    setIsPopupOpen={setIsPopupOpen}
                    isPopupOpen={isPopupOpen}
                />
            )}
        </MediaPlayerContainer>
    );
};

const MediaPlayerContainer = styled.div`
    ${tw`w-full h-full max-h-full flex flex-col items-center`}
`;
const MediaPlayerTypeMenu = styled.div`
    ${tw`flex flex-row items-center h-1/10`};

    button {
        ${tw`px-4 py-2 mb-2 text-base text-white cursor-pointer`}
    }

    span {
        ${tw``}
    }
`;

export default MediaPlayer;
