import { useDispatch } from 'react-redux';
import { setBurnAssets, setLoading } from '@state/features';
import { Api } from '@libs/API';
import { Asset, BurnAsset } from '@definitions/Asset';
import { useNavigate } from 'react-router-dom';

export const useSetAssets = async (walletAddress: string) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return async () => {
        try {
            dispatch(setLoading(true));

            /*let ba: Array<BurnAsset> =
          await Api.asset.getAllBurnablesByWalletAddress(walletAddress);
      let oa: Array<Asset> =
          await Api.asset.getAlByWalletAddressNoBurnables(walletAddress);

      dispatch(setWalletAssets(oa));
      dispatch(setBurnAssets(ba));
      if (!oa.length && ba.length) navigate('/Burn');*/
        } catch (error) {
            console.error(error);
        } finally {
            dispatch(setLoading(false));
        }
    }; // Return the setAssets function
};
