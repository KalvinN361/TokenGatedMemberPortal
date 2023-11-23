import React, { Suspense, useEffect, useState } from 'react';
import { ClaimCardContainer } from '@components/Claim';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@state/store';
import { Api } from '@libs/API';
import { setClaimItems } from '@state/features';
import {
    Overlay,
    PVPage,
    PVBody,
    PVFooter,
    PVHeader,
    PoweredByVenkman,
    PVGridContainer,
    PVInfoContainer,
    Spinner,
} from '@components/Base';
import { ClaimFull } from '@definitions/index';

export const Claim: React.FC = (props) => {
    const dispatch = useDispatch();
    const assets = useSelector((state: RootState) => state.assets);
    const claim = useSelector((state: RootState) => state.claim) || [];
    const [assetIds, setAssetIds] = useState<Array<string>>([]);

    const billSplash =
        'https://storage.googleapis.com/billmurray1000/WebAssets/image/Backgrounds/Blank-Desk.jpg';

    useEffect(() => {
        if (!assets.owned) return;
        setAssetIds(assets.owned.map((ownedAsset) => ownedAsset.id));
    }, [assets.owned]);

    useEffect(() => {
        if (!assetIds || assetIds.length < 1) return;

        (async () => {
            let allClaims = await Api.claim
                .getAllByAssetIds(assetIds)
                .then(async (res) => {
                    return res;
                });
            if (allClaims.length > 0) {
                dispatch(setClaimItems(allClaims));
            }
        })();
    }, [assetIds]);

    return (
        <PVPage id={'claim-page'} bgImage={billSplash}>
            <Overlay id={'claim-page-overlay'} color={'black'} />
            <PVHeader id={'claim-page-header'}>
                <h1>Claimable</h1>
            </PVHeader>
            <PVBody id={'claim-page-body'}>
                {claim.items.length > 0 && (
                    <PVGridContainer id={'claim-grid-container'} columns={4}>
                        {claim.items.map((claim: ClaimFull, i: number) => (
                            <Suspense
                                key={i}
                                fallback={
                                    <Spinner
                                        hidden={false}
                                        background={false}
                                        absolute={true}
                                    />
                                }
                            >
                                <ClaimCardContainer key={i} claim={claim} />
                            </Suspense>
                        ))}
                    </PVGridContainer>
                )}
                {!claim.items.length && (
                    <PVInfoContainer
                        id={'claim-info-container'}
                        title={'Claims Unvailable'}
                    >
                        <p>
                            You do not have any claims. These have unclaimed
                            coins
                        </p>
                    </PVInfoContainer>
                )}
            </PVBody>
            <PVFooter id={'claim-page-footer'}>
                <PoweredByVenkman color={'White'} />
            </PVFooter>
        </PVPage>
    );
};

export default Claim;
