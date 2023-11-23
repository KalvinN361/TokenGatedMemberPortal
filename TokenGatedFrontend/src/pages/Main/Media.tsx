import React, { Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { MediaDescription } from '@components/Media/MediaDescription';
import { setCurrentAsset, setMediaItems } from '@state/features';
import MediaPlayer from '@components/Media/MediaPlayer';
import {
    PoweredByVenkman,
    PVBody,
    PVFooter,
    PVHeader,
    PVPage,
    Spinner,
} from '@components/Base';
import { useParams } from 'react-router';
import Overlay from '@components/Base/Utility/Overlay';

const NavbarMedia = React.lazy(
    () => import('@components/Navigation/NavbarMedia')
);

type MediaPageProps<P = {}> = P;

export const MediaPage: React.FC<MediaPageProps> = (props) => {
    const {} = props;
    const assets = useSelector((state: RootState) => state.assets);

    const [activeMedia, setActiveMedia] = useState<any>('description');
    const [assetIds, setAssetIds] = useState<Array<string>>([]);
    const billSplash =
        'https://storage.googleapis.com/billmurray1000/WebAssets/image/Backgrounds/Blank-Desk.jpg';

    useEffect(() => {
        if (!assets.owned) return;
        setAssetIds(assets.owned.map((asset) => asset.id));
        setCurrentAsset(assets.owned[0]);
    }, [assets.owned]);
    return (
        <PVPage id={'media-page'} bgImage={billSplash}>
            <Overlay id={'media-page-overlay'} color={'black'} />
            <PVHeader id={'media-header'}>
                <Suspense
                    fallback={
                        <Spinner
                            hidden={false}
                            background={false}
                            absolute={true}
                        />
                    }
                >
                    <NavbarMedia
                        setActiveMedia={setActiveMedia}
                        activeMedia={activeMedia}
                    />
                </Suspense>
            </PVHeader>
            <PVBody id={'media-body'}>
                {activeMedia === 'description' && <MediaDescription />}
                {activeMedia === 'audio' && (
                    <MediaPlayer mediaType={'audio'} assetIds={assetIds} />
                )}
                {activeMedia === 'video' && (
                    <MediaPlayer mediaType={'video'} assetIds={assetIds} />
                )}
                {activeMedia === 'image' && (
                    <MediaPlayer mediaType={'image'} assetIds={assetIds} />
                )}
            </PVBody>
            <PVFooter id={'media-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
        </PVPage>
    );
};
export default MediaPage;
