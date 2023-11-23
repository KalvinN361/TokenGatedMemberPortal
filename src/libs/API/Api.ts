import { assetApi } from './assetAPI';
import { asset1155Api } from './asset1155API';
import { authApi } from './authAPI';
import { blockchainApi } from './blockchainAPI';
import { chiveApi } from './chiveAPI';
import { claimApi } from './claimAPI';
import { collectApi } from './collectAPI';
import { companyApi } from './companyAPI';
import { contractApi } from './contractAPI';
import { eventApi } from './eventAPI';
import { googleSheetApi } from './googleSheetAPI';
import { shopAPI } from '@libs/API/shopAPI';
import { mediaApi } from './mediaAPI';

export const Api = {
    asset: assetApi,
    asset1155: asset1155Api,
    auth: authApi,
    blockchain: blockchainApi,
    chive: chiveApi,
    claim: claimApi,
    collect: collectApi,
    company: companyApi,
    contract: contractApi,
    events: eventApi,
    googleSheets: googleSheetApi,
    shop: shopAPI,
    media: mediaApi,
};
