import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProjectState {
    name: string;
    messageSigned: boolean;
}

const initialState: ProjectState = {
    name: '',
    messageSigned: false,
};

export const projectSlice = createSlice({
    initialState: initialState,
    name: 'project',
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setMessageSigned: (state, action: PayloadAction<boolean>) => {
            state.messageSigned = action.payload;
        },
    },
});

export const { setName, setMessageSigned } = projectSlice.actions;
