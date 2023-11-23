import * as ApiFx from './ApiScripts';
import { apiConfig } from './ApiScripts';
import { Company } from '@definitions/Company';

export const companyApi = {
    getAll: async () => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated('Company/GetAll', apiConfig).then(
            async (res) => {
                return (await res.data.companies) as Array<Company>;
            }
        );
    },
    getOne: async (domain: string) => {
        apiConfig.version = 'v2';
        return await ApiFx.GETAuthenticated(
            `Company/GetOne/${domain}`,
            apiConfig
        ).then(async (res) => {
            return res.data.company as Company;
        });
    },
};
