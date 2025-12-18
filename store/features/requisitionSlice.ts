import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getRequisitions } from '@/api/requisitionApi';
import { Requisition } from '@/interface/requisition';
import { RootState } from '../store';

export interface RequisitionState {
  requisitions: Partial<Requisition>[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RequisitionState = {
  requisitions: [],
  status: 'idle',
  error: null,
};

export const fetchRequisitions = createAsyncThunk(
  'requisitions/fetchRequisitions',
  async (status: string | undefined, { rejectWithValue }) => {
    try {
      const response = await getRequisitions(status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.toString());
    }
  }
);

export const requisitionSlice = createSlice({
  name: 'requisitions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequisitions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequisitions.fulfilled, (state, action: PayloadAction<Partial<Requisition>[]>) => {
        state.status = 'succeeded';
        state.requisitions = action.payload;
      })
      .addCase(fetchRequisitions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const selectRequisitions = (state: RootState) => state.requisitions.requisitions;
export const selectRequisitionsStatus = (state: RootState) => state.requisitions.status;

export default requisitionSlice.reducer;
