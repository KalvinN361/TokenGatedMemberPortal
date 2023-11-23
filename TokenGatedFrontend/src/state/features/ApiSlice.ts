import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const apiSlice = createSlice({
    initialState: '',
    name: 'walletAddress',
    reducers: {
        setApiHost: (state, action: PayloadAction<string>) => {
            return action.payload;
        },
    },
});

export const { setApiHost } = apiSlice.actions;

export default apiSlice.reducer;
