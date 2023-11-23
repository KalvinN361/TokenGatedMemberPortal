import React, { FC, useEffect, useState } from 'react';
import { RootState } from '@state/store';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Attribute } from '@definitions/Asset';
import { getEmbellishment, getNewFrame } from '@libs/utils';

type UpgradePreviewProps<P = {}> = P;

const watermark =
    'https://storage.googleapis.com/billmurray1000/Watermarks/WATERMARK-GLASSES.png';
const glassDir = 'https://storage.googleapis.com/billmurray1000/3DUpgrades/';
const rick = 'efe0d138-eb40-4ec8-8714-0d02ca5b59ab';

export const UpgradePreview: FC<UpgradePreviewProps> = (props) => {
    const {} = props;
    const [newFrame, setNewFrame] = useState<string>('');
    const burn = useSelector((state: RootState) => state.burn);

    useEffect(() => {
        if (!burn.selectedAsset.image) return;
        let attributes = burn.selectedAsset.attributes;
        let frames = (
            attributes.find((a) => a.traitType === 'Frames') as Attribute
        ).value;
        let embelishments = (
            attributes.find(
                (a) => a.traitType === 'Hand Embellishments'
            ) as Attribute
        ).value;
        let newFrames = getNewFrame(frames);
        let newEmbellishments = getEmbellishment(embelishments);

        let newFrameImage = `${glassDir}${newFrames}-GLASSES${
            newEmbellishments !== null ? '-' + newEmbellishments : ''
        }.png`;
        if (burn.selectedAsset.contractId === rick)
            newFrameImage = newFrameImage.replace('GLASSES', 'SHIRT');
        setNewFrame(newFrameImage);
    }, [burn.selectedAsset]);

    return (
        <UpgradePreviewStyled>
            {burn.selectedAsset.image &&
                burn.selectedAsset.image.indexOf('https') > -1 && (
                    <UpgradePreviewContainer
                        className={'relative h-full w-full'}
                    >
                        <UpgradePreviewImage src={burn.selectedAsset.image} />
                        ,
                        <UpgradePreviewImage src={newFrame} />,
                        <UpgradePreviewImage
                            className={'watermark'}
                            src={watermark}
                        />
                    </UpgradePreviewContainer>
                )}
        </UpgradePreviewStyled>
    );
};

const UpgradePreviewStyled = styled.div`
    ${tw`p-4 w-full h-full`}
`;

const UpgradePreviewContainer = styled.div`
    ${tw`relative h-full w-full`}
`;

const UpgradePreviewImage = styled.img`
    ${tw`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-full w-full max-h-[340px] max-w-[440px] object-contain`}
    &.watermark {
        ${tw`opacity-25`}
    }
`;

export default UpgradePreview;
