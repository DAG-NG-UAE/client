import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import authReducer from './slices/auth';
import positionsReducer from './slices/positions';
import requisitionReducer from './slices/requisition';
import candidateReducer from './slices/candidates';
import interviewReducer from './slices/interview';
import userReducer from './slices/user';
import offerReducer from './slices/offer'

// ----------------------------------------------------------------------

const createNoopStorage = () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem(_key: string) {
    return Promise.resolve(null);
  },
  setItem(_key: string, value: any) {
    return Promise.resolve(value);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem(_key: string) {
    return Promise.resolve();
  },
});

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
};



const rootReducer = combineReducers({
  auth: authReducer,
  positions: positionsReducer,
  requisitions: requisitionReducer,
  candidates: candidateReducer,
  interviews: interviewReducer,
  users: userReducer,
  offers: offerReducer
});

export { rootPersistConfig, rootReducer };