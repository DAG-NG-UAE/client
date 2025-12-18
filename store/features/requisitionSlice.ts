import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getRequisitions, getSingleRequisition } from '@/api/requisitionApi';
import { Requisition } from '@/interface/requisition';
import { RootState } from '../store';

export interface RequisitionState {
  requisitions: Partial<Requisition>[];
  selectedRequisition: Partial<Requisition> | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: RequisitionState = {
  requisitions: [],
  selectedRequisition: null,
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

export const fetchRequisitionById = createAsyncThunk(
    'requisitions/fetchRequisitionById',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await getSingleRequisition(id);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.toString());
        }
    }
)

export const requisitionSlice = createSlice({
  name: 'requisitions',
  initialState,
  reducers: {
    setSelectedRequisition: (state, action: PayloadAction<Partial<Requisition>>) => {
        state.selectedRequisition = action.payload;
    },
    clearSelectedRequisition: (state) => {
        state.selectedRequisition = null;
    }
  },
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
      })
      .addCase(fetchRequisitionById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRequisitionById.fulfilled, (state, action: PayloadAction<Partial<Requisition>>) => {
        state.status = 'succeeded';
        state.selectedRequisition = { ...state.selectedRequisition, ...action.payload };
      })
      .addCase(fetchRequisitionById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedRequisition, clearSelectedRequisition } = requisitionSlice.actions;

export const selectRequisitions = (state: RootState) => state.requisitions.requisitions;
export const selectRequisitionsStatus = (state: RootState) => state.requisitions.status;
export const selectSelectedRequisition = (state: RootState) => state.requisitions.selectedRequisition;

export default requisitionSlice.reducer;
