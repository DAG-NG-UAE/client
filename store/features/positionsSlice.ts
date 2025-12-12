import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getPosition } from '@/api/requisitionApi';
import { AvailablePositions } from '@/interface/requisition';
import { RootState } from '../store';

export interface PositionsState {
  positions: AvailablePositions[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PositionsState = {
  positions: [],
  status: 'idle',
  error: null,
};

// Async thunk for fetching positions
export const fetchPositions = createAsyncThunk('positions/fetchPositions', async () => {
  const response = await getPosition();
  return response;
});

export const positionsSlice = createSlice({
  name: 'positions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPositions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPositions.fulfilled, (state, action: PayloadAction<AvailablePositions[]>) => {
        state.status = 'succeeded';
        state.positions = action.payload;
      })
      .addCase(fetchPositions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch positions';
      });
  },
});

// Selector to get positions from the state
export const selectAllPositions = (state: RootState) => state.positions.positions;

export default positionsSlice.reducer;
