import React, { useEffect } from 'react';
import { Asset, Asset1155Portal, HomeProps } from '@definitions/index';
import { RootState } from '@state/store';
import { useDispatch, useSelector } from 'react-redux';
import { Api } from '@libs/API';
import {
    setWalletAddress,
    setLoading,
    setCurrentAsset,
    setOceanAssets,
    setOwnedAssets,
    setNoOpenEditionsAssets,
    setIsMagic,
} from '@state/features';
import { useNavigate } from 'react-router-dom';
import { BMHome, ELFHome, PVHome } from '@components/Home';
import { LoadingState } from '@state/features/LoadingSlice';
import { useAccount } from 'wagmi';
import { isAsset } from '@libs/utils';

export const Home: React.FC<HomeProps> = (props) => {
    const {} = props;
    const currentUrl = new URL(window.location.href);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const owner = useSelector((state: RootState) => state.owner);
    const assets = useSelector((state: RootState) => state.assets);
    const loading: LoadingState = useSelector(
        (state: RootState) => state.isLoading
    );
    //const [assetIds, setAssetIds] = useState<Array<string>>([]);
    const { isConnected, connector } = useAccount();

    useEffect(() => {
        if (isConnected) return;
        navigate('/');
    }, [isConnected]);

    useEffect(() => {
        if (!connector) return;
        if (connector.id === 'magic') dispatch(setIsMagic(true));
        else dispatch(setIsMagic(false));
    }, [connector]);

    useEffect(() => {
        (async () => {
            if (!owner.walletAddress || owner.walletAddress === '') {
                await Api.auth.whoamI().then(async (res: string) => {
                    dispatch(setWalletAddress(res));
                });
            } else {
                try {
                    dispatch(setLoading(true));
                    let walletAssets: Array<Asset> =
                        await Api.asset.getAlByWalletAddressNoBurnables(
                            owner.walletAddress
                        );
                    let oceanAsset: Asset1155Portal =
                        await Api.asset1155.getAllByWalletAddressAndToken(
                            owner.walletAddress,
                            'a5e1d065-534a-4a8b-8741-5703ebc74c76'
                        );
                    let ownerAssets: Array<Asset | Asset1155Portal> = oceanAsset
                        ? [...walletAssets, oceanAsset]
                        : walletAssets;
                    let noOpenEditions: Array<Asset | Asset1155Portal> =
                        ownerAssets.filter((a: Asset | Asset1155Portal) => {
                            if (isAsset(a)) {
                                return (
                                    a.contractId !==
                                    'a093a9d9-ee65-4c5d-9c8d-ca94094bb1e8'
                                );
                            } else {
                                return a;
                            }
                        });

                    dispatch(setOceanAssets(oceanAsset));
                    dispatch(setOwnedAssets(ownerAssets));
                    dispatch(setNoOpenEditionsAssets(noOpenEditions));
                } catch (e) {
                    //console.log(e);
                } finally {
                    dispatch(setLoading(false));
                }
            }
        })();
    }, [owner.walletAddress]);

    useEffect(() => {
        if (!assets.owned) return;
        setCurrentAsset(assets.owned[0]);
    }, [assets.owned]);

    switch (true) {
        case currentUrl.hostname.includes('billmurray'):
            return <BMHome isLoading={loading} />;
        case currentUrl.hostname.includes('earthlight'):
            return <ELFHome isLoading={loading} />;
        default:
            return <BMHome isLoading={loading} />;
        //return <PVHome isLoading={loading} />;
    }
};
export default Home;
