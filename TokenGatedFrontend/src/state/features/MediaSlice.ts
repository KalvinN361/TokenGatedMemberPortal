import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Media } from '@definitions/Media';

interface mediaState {
    items: Array<Media>;
}

const initialState: mediaState = {
    items: [] as Array<Media>,
};

export const mediaSlice = createSlice({
    initialState: initialState,
    name: 'media',
    reducers: {
        setMediaItems: (state, action: PayloadAction<Array<Media>>) => {
            state.items = [...action.payload];
        },
    },
});

export const { setMediaItems } = mediaSlice.actions;

export default mediaSlice.reducer;
