import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';

export const contractApi = {
    getAll: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            'Contract/GetAll?includeAssets=false',
            apiConfig
        ).then(async (res) => {
            return await res.data.contracts;
        });
    },
    getAllWithAssets: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            'Contract/GetAll?includeAssets=true',
            apiConfig
        ).then(async (res) => {
            return await res.data.contracts;
        });
    },
    getAllBurnableContracts: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            'Contract/GetAll/Burnable',
            apiConfig
        ).then(async (res) => {
            return await res.data.contracts;
        });
    },
    getOneByContractId: async (contractId: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Contract/GetOne/${contractId}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.contract;
        });
    },
    getOneBySymbol: async (symbol: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Contract/GetOneBySymbol/${symbol}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.contract;
        });
    },
};
