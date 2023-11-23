import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ownerState {
    walletAddress: string;
    isMagic: boolean;
}

const initialState: ownerState = {
    walletAddress: '',
    isMagic: false,
};

export const ownerSlice = createSlice({
    initialState: initialState,
    name: 'owner',
    reducers: {
        setWalletAddress: (state, action: PayloadAction<string>) => {
            state.walletAddress = action.payload;
        },
        setIsMagic: (state, action: PayloadAction<boolean>) => {
            state.isMagic = action.payload;
        },
    },
});

export const { setWalletAddress, setIsMagic } = ownerSlice.actions;

export default ownerSlice.reducer;
