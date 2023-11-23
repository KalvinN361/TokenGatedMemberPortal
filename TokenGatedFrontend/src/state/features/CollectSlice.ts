import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contract } from '@definitions/Contract';

interface collectDropContractState {
    drop: Contract;
    email: string;
    referral: string;
}

const initialState: collectDropContractState = {
    drop: {} as Contract,
    email: '',
    referral: '',
} as collectDropContractState;

export const collectSlice = createSlice({
    initialState: initialState,
    name: 'CollectDropContract',
    reducers: {
        setDrop: (state, action: PayloadAction<Contract>) => {
            state.drop = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setReferral: (state, action: PayloadAction<string>) => {
            state.referral = action.payload;
        },
    },
});

export const { setDrop, setEmail, setReferral } = collectSlice.actions;
