import { configureStore } from '@reduxjs/toolkit';
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import { dispatch, setDispatch } from './dispatchHandle';
import { persistStore, persistReducer } from 'redux-persist';
import { rootPersistConfig, rootReducer } from './rootReducer';


const store = configureStore({
  reducer: persistReducer(rootPersistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

setDispatch(store.dispatch)

const useDispatch = () => useAppDispatch<AppDispatch>();

const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export { store, persistor, useSelector, useDispatch };