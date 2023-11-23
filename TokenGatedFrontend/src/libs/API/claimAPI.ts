import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';
import { Claim } from '@definitions/Claim';

export const claimApi = {
    getAllByTypeInventory: async (claimType: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Claim/GetAll/Type/${claimType}/Inventory`,
            apiConfig
        ).then(async (res) => {
            return res.data.claims;
        });
    },
    getAllCoinsByName: async (name: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Claim/GetAll/Coins/Name/${name}`,
            apiConfig
        ).then(async (res) => {
            return res.data.claims;
        });
    },
    getAllByAsset: async (assetId: string) => {
        let data = { assetId: assetId };
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Claim/GetAll/Asset/${assetId}`,
            apiConfig
        ).then(async (res) => {
            return res.data.claims;
        });
    },
    getAllByAssetIds: async (assetIds: string[]) => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            `Claim/GetAllByAssetIds`,
            apiConfig,
            { assetIds: assetIds }
        ).then(async (res) => {
            return res.data.claims;
        });
    },
    getAllUnclaimed: async (
        name: string,
        treasury: boolean,
        contractId: string
    ) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Claim/GetAll/Name/${name}/UnclaimedCoins?treasury=${treasury}&contractId=${contractId}`,
            apiConfig
        ).then(async (res) => {
            return res.data.unclaims;
        });
    },
    update: async (data: Claim) => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            'Claim/Update',
            apiConfig,
            data
        ).then(async (res) => {});
    },
    updateInventory: async (claim: Claim) => {
        let data = { claim: claim };
        apiConfig.version = 'v2';
        return await ApiFx.PATCHAuthenticated(
            'Claim/UpdateInventory',
            apiConfig,
            data
        ).then(async (res) => {});
    },
};
