import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';

export const eventApi = {
    getAll: async (data: any) => {
        apiConfig.version = 'v2';
        return await ApiFx.POSTAuthenticated(
            'Something/Media',
            apiConfig,
            data
        ).then(async (res) => {
            return await res.data;
        });
    },
};
