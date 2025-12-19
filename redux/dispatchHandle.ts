// dispatch-handle.ts
import { AppDispatch } from './store';

// We create a variable that will hold our dispatch function once the store is ready
export let dispatch: AppDispatch;

export const setDispatch = (d: AppDispatch) => {
  dispatch = d;
};