import { configureStore } from '@reduxjs/toolkit';
import { reducers } from './index';

const store = configureStore({
    reducer: reducers,
    devTools: true,
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

export default store;
