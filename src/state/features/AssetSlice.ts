import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Asset } from '@definitions/Asset';
import { Asset1155Portal } from '@definitions/Asset1155';
import { isAsset, isAsset1155Portal } from '@libs/utils';

interface AssetState {
    ocean: Asset1155Portal | null;
    owned: Array<Asset | Asset1155Portal>;
    noOpenEdition: Array<Asset | Asset1155Portal>;
    current: Asset | Asset1155Portal | null;
}

const initialState: AssetState = {
    ocean: null as Asset1155Portal | null,
    owned: [],
    noOpenEdition: [],
    current: null as Asset | Asset1155Portal | null,
};

export const assetSlice = createSlice({
    initialState: initialState,
    name: 'assets',
    reducers: {
        setOceanAssets: (state, action: PayloadAction<Asset1155Portal>) => {
            state.ocean = action.payload;
        },
        setOwnedAssets: (
            state,
            action: PayloadAction<Array<Asset | Asset1155Portal>>
        ) => {
            state.owned = [...action.payload];
        },
        setNoOpenEditionsAssets: (
            state,
            action: PayloadAction<Array<Asset | Asset1155Portal>>
        ) => {
            state.noOpenEdition = [...action.payload];
        },
        setCurrentAsset: (
            state,
            action: PayloadAction<Asset | Asset1155Portal>
        ) => {
            if (isAsset({ ...action.payload }))
                state.current = { ...action.payload } as Asset;
            else if (isAsset1155Portal(action.payload))
                state.current = { ...action.payload } as Asset1155Portal;
        },
    },
});

export const {
    setOceanAssets,
    setOwnedAssets,
    setCurrentAsset,
    setNoOpenEditionsAssets,
} = assetSlice.actions;
export default assetSlice.reducer;
