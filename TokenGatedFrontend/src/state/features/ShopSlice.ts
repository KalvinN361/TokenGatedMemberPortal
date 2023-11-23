import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Shop } from '@definitions/index';

interface ShopState {
    listings: Array<Shop>;
    trades: Array<Shop>;
    merchs: Array<Shop>;
}

const initialState: ShopState = {
    listings: [] as Array<Shop>,
    trades: [] as Array<Shop>,
    merchs: [] as Array<Shop>,
};
export const shopSlice = createSlice({
    initialState: initialState,
    name: 'shop',
    reducers: {
        setListings: (state, action: PayloadAction<Array<Shop>>) => {
            state.listings = [...action.payload];
        },
        setTrades: (state, action: PayloadAction<Array<Shop>>) => {
            state.trades = [...action.payload];
        },
        setMerchs: (state, action: PayloadAction<Array<Shop>>) => {
            state.merchs = [...action.payload];
        },
    },
});

export const { setListings, setTrades, setMerchs } = shopSlice.actions;

export default shopSlice.reducer;
