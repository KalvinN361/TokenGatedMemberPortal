import { FC, useEffect, useState } from 'react';
import PVPage from '@components/Base/PVPage/PVPage';
import Overlay from '@components/Base/Utility/Overlay';
import { PoweredByVenkman, PVFooter, PVHeader } from '@components/Base';
import PVBody from '@components/Base/PVPage/PVBody';
import styled from 'styled-components';
import tw from 'twin.macro';

interface GleamProps {
    isOpen: boolean;
}

const billSplash =
    'https://storage.googleapis.com/billmurray1000/WebAssets/image/Backgrounds/Blank-Desk.jpg';

export const Gleam: FC<GleamProps> = ({ isOpen: isOpenProp }) => {
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (!isOpenProp) return;
        const existingScript = document.getElementById('gleamScript');

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://widget.gleamjs.io/e.js';
            script.async = true;
            script.id = 'gleamScript';
            document.body.appendChild(script);
            setOpenModal(isOpenProp);
        }
    }, [isOpenProp]);

    const handleHomeClick = () => {
        window.location.href = '/Home';
    };

    return (
        <PVPage id={'gleam-page'} bgImage={billSplash}>
            <Overlay id={'gleam-overlay'} color={'black'} />
            <PVHeader id={'gleam-header'}>
                <h1>Bill Murray 1000 Club Giveaways</h1>
            </PVHeader>
            <PVBody id={'gleam-body'}>
                <GleamContainer id={'gleam-container'}>
                    <GleamContent id={'gleam-content'}>
                        <GleamItem className={'todo'} id={'gleam-to-do'}>
                            <h2>To Do's</h2>
                            <a
                                className="e-widget no-button generic-loader block"
                                href="https://gleam.io/TYo7m/bill-murray-1000-club-giveaway"
                                rel="nofollow"
                            >
                                Bill Murray 1000 Club Giveaway
                            </a>
                        </GleamItem>

                        <GleamItem
                            className={'leaderboard'}
                            id={'gleam-leaderboard'}
                            onLoad={() => window.scrollTo(0, 0)}
                        >
                            <h2>Leaderboard</h2>
                            <a
                                className="e-widget no-button leaderboard block"
                                href="https://gleam.io/TYo7m/leaderboard"
                                rel="nofollow"
                            >
                                Bill Murray 1000 Club Giveaway
                            </a>
                        </GleamItem>
                    </GleamContent>
                </GleamContainer>
            </PVBody>
            <PVFooter id={'gleam-footer'}>
                <PoweredByVenkman color={'Black'} />
            </PVFooter>
        </PVPage>
    );
};

const GleamContainer = styled.div`
    ${tw`w-full bg-opacity-50 overflow-y-auto`};
`;
const GleamContent = styled.div`
    ${tw`flex flex-col md:flex-row items-center md:items-start md:justify-center space-y-4 md:space-y-0 md:space-x-4`};
`;
const GleamItem = styled.div`
    &.todo {
        ${tw`max-w-full md:max-w-[50%] w-full md:w-1/4 overflow-y-auto flex flex-col items-center`};
    }

    &.leaderboard {
        ${tw`flex flex-col justify-center items-center h-full overflow-y-auto`};
    }

    & > h2 {
        ${tw`text-2xl font-bold text-white mb-2 underline`};
    }
`;

export default Gleam;
