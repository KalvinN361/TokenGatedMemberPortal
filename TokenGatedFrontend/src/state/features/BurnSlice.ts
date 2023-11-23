import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Asset, BurnAsset } from '@definitions/index';

interface BurnAssetsState {
    assets: Array<BurnAsset>;
    current: BurnAsset;
    type: string;
    selected: string;
    optionPanel: string;
    optionSelected: 'burnandturn' | 'upgrade' | '';
    selectedAsset: Asset;
}

const initialState: BurnAssetsState = {
    assets: [],
    current: {} as BurnAsset,
    type: '',
    selected: '',
    optionPanel: '',
    optionSelected: '',
    selectedAsset: {} as Asset,
};

export const burnSlice = createSlice({
    initialState: initialState,
    name: 'BurnAssets',
    reducers: {
        setBurnAssets: (state, action: PayloadAction<Array<BurnAsset>>) => {
            state.assets = [...action.payload];
        },
        setCurrentBurnAsset: (state, action: PayloadAction<BurnAsset>) => {
            state.current = action.payload;
        },
        setBurnNowType: (state, action: PayloadAction<string>) => {
            state.type = action.payload;
        },
        setBurnSelected: (state, action: PayloadAction<string>) => {
            state.selected = action.payload;
        },
        setBurnOptionPanel: (state, action: PayloadAction<string>) => {
            state.optionPanel = action.payload;
        },
        setOptionSelected: (
            state,
            action: PayloadAction<'burnandturn' | 'upgrade' | ''>
        ) => {
            state.optionSelected = action.payload;
        },
        setSelectedAsset: (state, action: PayloadAction<Asset>) => {
            state.selectedAsset = action.payload;
        },
    },
});

export const {
    setBurnAssets,
    setCurrentBurnAsset,
    setBurnSelected,
    setBurnOptionPanel,
    setBurnNowType,
    setOptionSelected,
    setSelectedAsset,
} = burnSlice.actions;
