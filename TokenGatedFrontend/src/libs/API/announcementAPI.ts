import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';

export const announcementApi = {
    getAll: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            'Announcements/GetAll',
            apiConfig
        ).then(async (res) => {
            return await res.data.announcements;
        });
    },
    getOneByAnnouncementId: async (announcementId: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Announcements/GetOne/Announcement/${announcementId}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.announcement;
        });
    },
    getOneByType: async (type: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Announcements/GetAll/Type/${type}`,
            apiConfig
        ).then(async (res) => {
            return await res.data.announcements;
        });
    },
};
