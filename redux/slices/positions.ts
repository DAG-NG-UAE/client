import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPosition } from '@/api/requisitionApi';
import { AvailablePositions } from '@/interface/requisition';
import { dispatch } from "../dispatchHandle";

export interface PositionsState {
  positions: AvailablePositions[];
  loading: boolean;
  error: string | null;
}

const initialState: PositionsState = {
  positions: [],
  loading: false,
  error: null,
};

export const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    hasError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setPositions(state, action: PayloadAction<AvailablePositions[]>) {
      state.loading = false;
      state.positions = action.payload;
    },
  },
});

export const {
  startLoading,
  hasError,
  setPositions
} = positionsSlice.actions;

export const fetchPositions = async () => {
  try {
    dispatch(startLoading());
    const response = await getPosition();
    console.log('positions slice =>', response)
    dispatch(setPositions(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  }
};

export default positionsSlice.reducer;
