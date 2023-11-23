import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';

export const asset1155Api = {
    getAll: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated('Asset1155/GetAll', apiConfig).then(
            async (res) => {
                return await res.data.assets;
            }
        );
    },
    getAllByToken: async (tokenId: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Asset1155/GetAll/Token/${tokenId}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.assets;
        });
    },
    getAllByWalletAddress: async (walletAddress: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Asset1155/GetAll/WalletAddress/${walletAddress}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.assets;
        });
    },
    getAllByWalletAddressAndToken: async (
        walletAddress: string,
        tokenId: string
    ) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Asset1155/GetAll/WalletAddress/${walletAddress}/Token/${tokenId}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.asset;
        });
    },
};
