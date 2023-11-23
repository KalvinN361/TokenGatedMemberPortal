import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';

export const googleSheetApi = {
    SyncDB: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            'Sheets/SyncDB',
            apiConfig,
            ''
        ).then(async (res) => {
            return await res.data;
        });
    },
};
