import { useSelector } from 'react-redux';
import { RootState } from '@state/store';
import React, { useEffect, useState } from 'react';
import { isAsset } from '@libs/utils';
import styled from 'styled-components';
import tw from 'twin.macro';

export type MediaDescriptionProps<P = {}> = P;
export const MediaDescription: React.FC<MediaDescriptionProps> = (props) => {
    const {} = props;
    let assets = useSelector((state: RootState) => state.assets);
    const [name, setName] = useState<string>('');
    const [tokenId, setTokenId] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<string>('');

    useEffect(() => {
        if (!assets.current) return;
        if (isAsset(assets.current)) {
            setName(assets.current.name);
            setTokenId(assets.current.tokenId);
            setDescription(assets.current.description);
            setImage(assets.current.imageSmall || assets.current.image);
        } else {
            setName(assets.current.token1155.name);
            setTokenId(assets.current.token1155.tokenId);
            setDescription(assets.current.token1155.description);
            setImage(assets.current.token1155.image);
        }
    }, [assets.current]);

    return (
        <MediaDescriptionStyled id={'media-description-container'}>
            <MediaInfoHeader>{`${name} (Token Id: ${tokenId})`}</MediaInfoHeader>
            <MediaInfoDataContainer>
                <MediaInfoDataImage className={'image'}>
                    <img src={image} />
                </MediaInfoDataImage>
                <div className={'description'}>
                    {description.split('\n\n').map((p: string, i: number) => {
                        return (
                            <MediaInfoDataParagraph key={i}>
                                {p}
                            </MediaInfoDataParagraph>
                        );
                    })}
                </div>
            </MediaInfoDataContainer>
        </MediaDescriptionStyled>
    );
};

const MediaDescriptionStyled = styled.div`
    ${tw`p-8 portrait:p-4 portrait:overflow-y-auto`}
`;
const MediaInfoHeader = styled.h1`
    ${tw`text-white text-center font-bold text-2xl text-gold mb-8`}
`;

const MediaInfoDataContainer = styled.div`
    ${tw`flex flex-col md:flex-row gap-4 justify-center`}
    > div {
        &.description {
            ${tw`w-full md:w-3/5`}
        }
    }
`;

const MediaInfoDataImage = styled.div`
    &.image {
        ${tw`w-full md:w-auto flex justify-center items-center`}
        > img {
            ${tw`border-8 border-white border-solid max-h-[400px] rounded-lg`}
        }
    }
`;

const MediaInfoDataParagraph = styled.p`
    ${tw`text-white pb-4 text-lg`}
`;

export default MediaDescription;
