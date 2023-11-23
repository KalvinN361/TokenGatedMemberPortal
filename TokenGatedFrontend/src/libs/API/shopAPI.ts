import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';
import { Shop } from '@definitions/Shop';

export const shopAPI = {
    getAllShops: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(`Shops/GetAll`, apiConfig).then(
            async (res) => {
                return res.data.shops as Array<Shop>;
            }
        );
    },
    getShop: async (id: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Shops/GetOne/${id}`,
            apiConfig
        ).then(async (res) => {
            return res.data.shop as Shop;
        });
    },
    getShopsByType: async (type: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Shops/GetAll/type/${type}`,
            apiConfig
        ).then(async (res) => {
            return res.data.shops as Array<Shop>;
        });
    },
    getShopsByWallet: async (walletAddress: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Shops/GetAll/WalletAddress/${walletAddress}`,
            apiConfig
        ).then(async (res) => {
            return res.data.shops as Array<Shop>;
        });
    },
    getShopsByWalletAndType: async (walletAddress: string, type: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Shops/GetAll/WalletAddress/${walletAddress}/Type/${type}`,
            apiConfig
        ).then(async (res) => {
            return res.data.shops as Array<Shop>;
        });
    },
};
