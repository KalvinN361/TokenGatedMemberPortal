import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';

export const authApi = {
    generateChallenge: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            'Auth/GenerateChallenge',
            apiConfig
        ).then(async (res) => {
            return res.data;
        });
    },
    issueTokens: async (message: string, signature: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated('Auth/IssueTokens', apiConfig, {
            message,
            signature,
        }).then(async (res) => {
            return res.data;
        });
    },
    whoamI: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated('Auth/WhoAmI', apiConfig, '').then(
            async (res) => {
                return res.data;
            }
        );
    },
    invalidateTokens: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            'Auth/InvalidateTokens',
            apiConfig,
            ''
        ).then(async (res) => {
            return res.data;
        });
    },
};
