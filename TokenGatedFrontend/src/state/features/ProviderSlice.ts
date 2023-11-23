// import { Web3Provider } from "@coinbase/wallet-sdk/dist/provider/Web3Provider";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExternalProvider } from '@ethersproject/providers';

export interface W3State {
    provider: ExternalProvider | null;
}
const initialState: W3State = {
    provider: null,
};

export const setProviderSlice = createSlice({
    initialState: initialState,
    name: 'provider',
    reducers: {
        setProvider: (state, action: PayloadAction<ExternalProvider>) => {
            state.provider = action.payload;
        },
    },
});

export const { setProvider } = setProviderSlice.actions;

export default setProviderSlice.reducer;
