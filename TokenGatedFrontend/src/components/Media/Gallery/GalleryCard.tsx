import React, { Dispatch } from 'react';
import { PVCard, PVCardFront } from '@components/Base';
import { Media } from '@definitions/Media';

type GalleryCardProps<
    P = {
        id: HTMLDivElement['id'];
        asset: Media;
        setOpenGalleryModal: Dispatch<React.SetStateAction<boolean>>;
        setCurrentMedia: React.Dispatch<React.SetStateAction<string>>;
        setCurrentName: React.Dispatch<React.SetStateAction<string>>;
    },
> = P;

export const GalleryCardContainer: React.FC<GalleryCardProps> = (props) => {
    const { id, asset, setOpenGalleryModal, setCurrentName, setCurrentMedia } =
        props;
    const imageUrl = asset.url;
    const imageAlt = asset.name;

    const handleGalleryModal = () => {
        setOpenGalleryModal(true);
        setCurrentMedia(imageUrl!);
        setCurrentName(imageAlt!);
    };

    return (
        <PVCard id={id} type={'gallery'} className={'gallery'}>
            <PVCardFront id={'Gallery-front'} className={'images'}>
                <img
                    id={'gallery-image'}
                    className={'object-cover'}
                    src={imageUrl}
                    alt={imageAlt}
                    onClick={handleGalleryModal}
                />
            </PVCardFront>
        </PVCard>
    );
};
