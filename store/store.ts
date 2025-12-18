import { configureStore } from '@reduxjs/toolkit';
import positionsReducer from './features/positionsSlice';
import authReducer from './features/authSlice';
import requisitionReducer from './features/requisitionSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      positions: positionsReducer,
      auth: authReducer,
      requisitions: requisitionReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];