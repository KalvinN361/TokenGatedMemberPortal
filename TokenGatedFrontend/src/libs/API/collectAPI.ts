import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';
import { Asset, Collect } from '@definitions/index';

export const collectApi = {
    getAll: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(`Collect/GetAll`, apiConfig).then(
            async (res) => {
                return res.data.collects as Array<Collect>;
            }
        );
    },
    getCountByContractId: async (contractId: string, ownerId: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Collect/GetCount/Contract/${contractId}/Owner/${ownerId}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.count;
        });
    },
    getOneByShortName: async (shortName: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Collect/GetOneByShortName/${shortName}`,
            apiConfig
        ).then(async (res) => {
            return res.data.collect as Collect;
        });
    },
    transferBMOE: async (
        contractId: string,
        walletAddress: string,
        email?: string
    ) => {
        apiConfig.version = 'v2';
        let data = { email: email };
        return await ApiFx.POSTAuthenticated(
            `Collect/TransferBMOE/DropContract/${contractId}/WalletAddress/${walletAddress}`,
            apiConfig,
            data
        ).then(async (res) => {
            return res.data.asset as Asset;
        });
    },
};
