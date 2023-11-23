import { combineReducers } from 'redux';
import { apiSlice } from './ApiSlice';
import { assetSlice } from './AssetSlice';
import { burnSlice } from './BurnSlice';
import { claimSlice } from './ClaimSlice';
import { collectSlice } from './CollectSlice';
import { shopSlice } from './ShopSlice';
import { loadingSlice } from './LoadingSlice';
import { mediaSlice } from './MediaSlice';
import { ownerSlice } from './OwnerSlice';
import { projectSlice } from './ProjectSlice';

export * from './ApiSlice';
export * from './AssetSlice';
export * from './ClaimSlice';
export * from './CollectSlice';
export * from './BurnSlice';
export * from './ShopSlice';
export * from './LoadingSlice';
export * from './MediaSlice';
export * from './OwnerSlice';
export * from './ProjectSlice';

const appReducers = combineReducers({
    api: apiSlice.reducer,
    assets: assetSlice.reducer,
    burn: burnSlice.reducer,
    claim: claimSlice.reducer,
    collect: collectSlice.reducer,
    isLoading: loadingSlice.reducer,
    shop: shopSlice.reducer,
    media: mediaSlice.reducer,
    project: projectSlice.reducer,
    owner: ownerSlice.reducer,
});

export const reducers = (state: any, action: any) => {
    if (action.type === 'RESET') state = undefined;
    return appReducers(state, action);
};
