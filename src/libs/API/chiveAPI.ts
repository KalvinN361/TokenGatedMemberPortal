import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';

export const chiveApi = {
    coins: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            'Chive/GoldBars',
            apiConfig,
            ''
        ).then(async (res) => {
            return await res.data;
        });
    },
};
