import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';

export const mediaApi = {
    getAll: async (data: any) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated('Media/GetAll', apiConfig).then(
            async (res) => {
                return await res.data.media;
            }
        );
    },
    getAllByAssets: async (assetIds: Array<string>) => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            `Media/GetAll/AssetByIds`,
            apiConfig,
            { assetIds: assetIds }
        ).then(async (res) => {
            return await res.data.media;
        });
    },
    getAllByAssetsAndType: async (assetIds: Array<string>, type: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            `Media/GetAll/AssetByIds/Type/${type}`,
            apiConfig,
            { assetIds: assetIds }
        ).then(async (res) => {
            return await res.data.media;
        });
    },
    getAllByCategories: async (categories: Array<string>) => {
        let categoryList = categories.join(',');
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Media/GetAll/Category/${categoryList}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.media;
        });
    },
    getOne: async (mediaId: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Media/GetOne/${mediaId}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.media;
        });
    },
};
