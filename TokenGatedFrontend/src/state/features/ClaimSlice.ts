import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Claim, ClaimFull } from '@definitions/index';

interface claimState {
    items: Array<ClaimFull>;
}

const initialState: claimState = {
    items: [] as Array<ClaimFull>,
};
export const claimSlice = createSlice({
    initialState: initialState,
    name: 'claim',
    reducers: {
        setClaimItems: (state, action: PayloadAction<Array<ClaimFull>>) => {
            state.items = [...action.payload];
        },
    },
});

export const { setClaimItems } = claimSlice.actions;

export default claimSlice.reducer;
