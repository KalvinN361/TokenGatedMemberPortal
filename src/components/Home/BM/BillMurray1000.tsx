import React, { lazy, Suspense, useEffect, useState } from 'react';
import { HomeProps } from '@definitions/Home';
import {
    ImageContainer,
    NftTitleSpan,
    HomeOverlayTopLeft,
    HomeOverlayTopRight,
    HomeOverlayBottomLeft,
    HomeOverlayBottomRight,
} from '@styles/index';
import {
    Overlay,
    PVPage,
    PVBody,
    PVFooter,
    PVHeader,
    PoweredByVenkman,
    PVInfoContainer,
    Spinner,
} from '@components/Base';
import { RootState } from '@state/store';
import { useSelector } from 'react-redux';
import { isAsset, isAsset1155Portal } from '@libs/utils';
import ItemSideSelect from '@components/Home/ItemSideSelect';
import { Gleam } from '@pages/Main/Gleam';
import { getCookie } from '@libs/getCookie';
import { setCookie } from '@libs/setCookie';
import { Welcome } from '@components/Welcome';
import TopLeft from '@assets/images/TL.png';
import TopRight from '@assets/images/TR.png';
import BottomLeft from '@assets/images/BL.png';
import BottomRight from '@assets/images/BR.png';
import { BMHomeCard, Invalid, BMBadge } from '@components/Home';
import styled from 'styled-components';
import tw from 'twin.macro';

const billSplash =
    'https://storage.googleapis.com/billmurray1000/WebAssets/image/Backgrounds/Blank-Desk.jpg';

export const BMHome: React.FC<HomeProps> = (props) => {
    const {} = props;
    const assets = useSelector((state: RootState) => state.assets);
    const [name, setName] = useState<string>('');
    const [tokenId, setTokenId] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [owned1155, setOwned1155] = useState<number>(1);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [openContestModal, setOpenContestModal] = useState<boolean>(false);

    const loading: boolean = useSelector(
        (state: RootState) => state.isLoading
    ).isLoading;

    const announcementTitle = 'Announcements';

    useEffect(() => {
        console.log({ assets });
        if (!assets.current) return;
        if (isAsset(assets.current)) {
            setName(assets.current.name);
            setTokenId(assets.current.tokenId);
            setImage(assets.current.imageSmall || assets.current.image);
        } else if (isAsset1155Portal(assets.current)) {
            setName(assets.current.token1155.name);
            setTokenId(assets.current.token1155.tokenId);
            setImage(assets.current.token1155.image);
            setOwned1155(assets.current.quantity);
        }
    }, [assets.current]);

    useEffect(() => {
        if (assets.owned.length > 0) {
            let welcomeMessage = getCookie('welcomeMessage');
            if (welcomeMessage) return;
            setOpenContestModal(true);
            setCookie('welcomeMessage', 'true', 1);
        }
    }, [assets]);

    return (
        <PVPage
            bgImage={billSplash}
            id={'home-page'}
            className={'overflow-auto'}
        >
            {window.innerWidth > 638 && (
                <Overlay id={'home-page-overlay'} color={'black'}>
                    <HomeOverlayTopLeft id={'home-overlay-top-left'}>
                        <img src={TopLeft} />
                    </HomeOverlayTopLeft>
                    <HomeOverlayTopRight id={'home-overlay-top-right'}>
                        <img src={TopRight} />
                    </HomeOverlayTopRight>
                    <HomeOverlayBottomLeft id={'home-overlay-bottom-left'}>
                        <img src={BottomLeft} />
                    </HomeOverlayBottomLeft>
                    <HomeOverlayBottomRight id={'home-overlay-bottom-right'}>
                        <img src={BottomRight} />
                    </HomeOverlayBottomRight>
                </Overlay>
            )}

            <PVHeader id={'home-page-header'}></PVHeader>
            <PVBody id={'home-page-body'}>
                {loading && !assets.owned.length && (
                    <BMHomeCard id={'home-card'}>
                        <ImageContainer id={'image-container'}>
                            <Spinner
                                hidden={false}
                                background={false}
                                absolute={true}
                            />
                        </ImageContainer>
                    </BMHomeCard>
                )}
                {assets.owned.length && (
                    <BMHomeCard id={'home-card'}>
                        {!loading && (
                            <NftTitleSpan>{`${name} (id: ${tokenId}, owned: ${owned1155})`}</NftTitleSpan>
                        )}
                        <BMBadge
                            loaded={loaded}
                            image={image}
                            setLoaded={setLoaded}
                        />
                    </BMHomeCard>
                )}
                {!assets.owned.length && !loading && (
                    <BMHomeCard id={'result-card'}>
                        <ImageContainer id={'image-container'}>
                            <Invalid />
                        </ImageContainer>
                    </BMHomeCard>
                )}
                <BulletinBoard id={'home-bulletin-board'}>
                    <PVInfoContainer
                        id={'home-announcements'}
                        title={announcementTitle}
                    >
                        <div></div>
                    </PVInfoContainer>
                </BulletinBoard>
                {assets.owned.length > 0 && !loading && <ItemSideSelect />}
                <Welcome
                    setOpenModal={setOpenContestModal}
                    openModal={openContestModal}
                />
            </PVBody>
            <PVFooter id={'home-page-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
            {/* <Gleam isOpen={openContestModal} /> */}
        </PVPage>
    );
};

const BulletinBoard = styled.div`
    ${tw`
        h-full w-full px-4 lg:px-12 
        flex justify-center items-end md:items-start md:justify-end 
        absolute md:relative top-1/2 md:top-auto translate-y-[13%] md:translate-y-0
`}
`;

export default BMHome;
