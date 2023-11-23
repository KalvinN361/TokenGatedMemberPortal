import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';

export const assetApi = {
    getAll: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated('Asset/GetAll', apiConfig).then(
            async (res) => {
                return await res.data.assets;
            }
        );
    },
    getAllByIds: async (assetIds: string[]) => {
        let assetList = assetIds.join(',');
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Asset/GetAll/${assetList}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.assets;
        });
    },
    getAllWithMetadata: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            'Asset/GetAll?withAttributes=true',
            apiConfig
        ).then(async (res) => {
            return await res.data.assets;
        });
    },
    getAllByContractId: async (contractTypeId: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Asset/GetAll/Contract/${contractTypeId}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.assets;
        });
    },
    getAllByWalletAddress: async (WalletAddress: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Asset/GetAll/WalletAddress/${WalletAddress}?includeBurnables=true`,
            apiConfig
        ).then(async (res) => {
            return await res.data.assets;
        });
    },
    getAlByWalletAddressNoBurnables: async (WalletAddress: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Asset/GetAll/WalletAddress/${WalletAddress}?includeBurnables=false`,
            apiConfig
        ).then(async (res) => {
            return await res.data.assets;
        });
    },
    getAllBurnablesByWalletAddress: async (WalletAddress: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Asset/GetAll/WalletAddress/${WalletAddress}/Burnables`,
            apiConfig
        ).then(async (res) => {
            return await res.data.assets;
        });
    },
    upgradeBill3DFrame: async (assetId: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            `Asset/UpgradeBill3DFrame/${assetId}`,
            apiConfig,
            ''
        ).then(async (res) => {
            return await res.data;
        });
    },
    updateOwner: async (assetId: string, walletAddress: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.PATCHAuthenticated(
            `Asset/Update/${assetId}/Owner/${walletAddress}`,
            apiConfig,
            {}
        ).then(async (res) => {
            return await res.data;
        });
    },
};
