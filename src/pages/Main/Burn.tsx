import React, { useEffect, useState } from 'react';
import { BurnAsset, BurnProps } from '@definitions/index';
import { BurnCardContainer, BurnModalComponent } from '@components/Burn';
import { RootState } from '@state/store';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@libs/API';
import { setBurnAssets } from '@state/features';
import {
    Overlay,
    PVPage,
    PVBody,
    PVFooter,
    PVHeader,
    PoweredByVenkman,
    PVGridContainer,
    PVInfoContainer,
} from '@components/Base';

export const Burn: React.FC<BurnProps> = (props) => {
    const {} = props;
    const dispatch = useDispatch();
    const owner = useSelector((state: RootState) => state.owner);
    const burn = useSelector((state: RootState) => state.burn);
    const [openBurnModal, setOpenBurnModal] = useState<boolean>(false);
    const [selectedBurnAsset, setSelectedBurnAsset] =
        useState<BurnAsset | null>(null);

    const billSplash =
        'https://storage.googleapis.com/billmurray1000/WebAssets/image/Backgrounds/Blank-Desk.jpg';

    useEffect(() => {
        if (!owner.walletAddress) return;
        (async () => {
            let burnAssets: Array<BurnAsset> =
                await Api.asset.getAllBurnablesByWalletAddress(
                    owner.walletAddress
                );
            dispatch(setBurnAssets(burnAssets));
        })();
    }, [owner.walletAddress]);

    return (
        <PVPage id={'burn-page'} bgImage={billSplash}>
            <Overlay id={'burn-page-overlay'} color={'black'} />
            <PVHeader id={'burn-page-header'}>
                <h1>Burnables</h1>
            </PVHeader>
            <PVBody id={'burn-page-body'}>
                {burn.assets.length > 0 && (
                    <PVGridContainer id={'burn-grid-container'} columns={3}>
                        {burn.assets.map(
                            (asset, i) =>
                                asset.name !== null && (
                                    <BurnCardContainer
                                        key={i}
                                        asset={asset}
                                        setOpenBurnModal={setOpenBurnModal}
                                        setSelectedBurnAsset={
                                            setSelectedBurnAsset
                                        }
                                    />
                                )
                        )}
                    </PVGridContainer>
                )}
                {!burn.assets.length && (
                    <PVInfoContainer
                        id={'burn-info-container'}
                        title={'Burnables Unvailable'}
                    >
                        <p>You do not have any burnables.</p>
                    </PVInfoContainer>
                )}
            </PVBody>
            <PVFooter id={'burn-page-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
            {openBurnModal && (
                <BurnModalComponent
                    openBurnModal={openBurnModal}
                    setOpenBurnModal={setOpenBurnModal}
                    selectedBurnAsset={selectedBurnAsset}
                />
            )}
        </PVPage>
    );
};

export default Burn;
