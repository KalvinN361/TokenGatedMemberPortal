import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';
import {
    HMMintStatusResponse,
    PVMintStatusResponse,
} from '@definitions/HyperMint';

export const blockchainApi = {
    mint3D: async (walletAddress: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            `Blockchain/Mint3DGlasses/WalletAddress/${walletAddress}`,
            apiConfig
        ).then(async (res) => {
            return await res.data;
        });
    },
    mint3DTest: async (walletAddress: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            `Blockchain/Mint3DGlassesTest/WalletAddress/${walletAddress}`,
            apiConfig
        ).then(async (res) => {
            return (await res.data) as PVMintStatusResponse;
        });
    },
};
