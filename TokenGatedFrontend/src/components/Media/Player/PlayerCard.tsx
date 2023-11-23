import React, { Dispatch } from 'react';
import { Asset } from '@definitions/Asset';
import { FaRegPaperPlane } from 'react-icons/fa6';
import {
    PVCard,
    PVCardButton,
    PVCardBackHeader,
    PVCardFront,
} from '@components/Base';
import PVCardBack from '@components/Base/PVCard/PVCardBack';
import PVCardBackBody from '@components/Base/PVCard/PVCardBackBody';
import PVCardBackFooter from '@components/Base/PVCard/PVCardBackFooter';
import { Media } from '@definitions/Media';

type PlayerCardProps<
    P = {
        id: HTMLDivElement['id'];
        asset: Media;
        setOpenPlayerModal: Dispatch<React.SetStateAction<boolean>>;
        setCurrentMedia: React.Dispatch<React.SetStateAction<string>>;
        setCurrentName: React.Dispatch<React.SetStateAction<string>>;
    },
> = P;

export const PlayerCardContainer: React.FC<PlayerCardProps> = (props) => {
    const { id, asset, setOpenPlayerModal, setCurrentName, setCurrentMedia } =
        props;
    const imageAlt = asset.name;
    const imageName = asset.name;
    const imagePlaceholder =
        'https://storage.googleapis.com/bm1000media/Misc/videoPlaceholder.png';

    const handlePlayerModal = () => {
        setOpenPlayerModal(true);
        setCurrentMedia(asset.url);
        setCurrentName(imageName);
    };

    return (
        <PVCard id={id} type={'gallery'} className={'placeholder gallery'}>
            <PVCardFront
                id={`player-card-front-${id}`}
                className={'placeholder'}
            >
                <div id={'player-card-name'} className="">
                    <span>{asset.name}</span>
                </div>
                <img
                    id={'player-placeholder'}
                    className={''}
                    src={imagePlaceholder}
                    alt={imageAlt}
                    onClick={handlePlayerModal}
                />
            </PVCardFront>
        </PVCard>
    );
};
