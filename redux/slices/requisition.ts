import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRequisitions, getSingleRequisition, holdRequisition, approveRequisition, unPublishRequisition, publishRequisition } from '@/api/requisitionApi';
import { RecruiterSelection, Requisition } from '@/interface/requisition';
import { dispatch } from "../dispatchHandle";
import { enqueueSnackbar } from 'notistack';


export interface RequisitionState {
  requisitions: Partial<Requisition>[];
  selectedRequisition: Partial<Requisition> | null;
  loading: boolean;
  error: string | null;
}

const initialState: RequisitionState = {
  requisitions: [],
  selectedRequisition: null,
  loading: false,
  error: null,
};

export const requisitionSlice = createSlice({
  name: 'requisitions',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    hasError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setRequisitions(state, action: PayloadAction<Partial<Requisition>[]>) {
      state.loading = false;
      state.requisitions = action.payload;
    },
    setSelectedRequisition: (state, action: PayloadAction<Partial<Requisition>>) => {
      state.loading = false;
      state.selectedRequisition = { ...state.selectedRequisition, ...action.payload };
    },
    clearSelectedRequisition: (state) => {
      state.selectedRequisition = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  setRequisitions,
  setSelectedRequisition,
  clearSelectedRequisition,
  clearError
} = requisitionSlice.actions;

export const fetchRequisitions = async(status?: string) => {
  try {
    dispatch(startLoading());
    const response = await getRequisitions(status);
    dispatch(setRequisitions(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  }
};

export const fetchRequisitionById = async(id: string) => {
  try {
    dispatch(startLoading());
    const response = await getSingleRequisition(id);
    dispatch(setSelectedRequisition(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  }
};

export const handleApproveRequisition = async({ recruiters, requisitionId }: { recruiters: RecruiterSelection[], requisitionId: string }) => {
  try {
    dispatch(startLoading());
    await approveRequisition(recruiters, requisitionId);
    await fetchRequisitions('pending')
    enqueueSnackbar('Requisition has been approved', { variant: 'success' });
    // Optionally refetch requisitions or update state directly
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  }
};

export const putRequisitionOnHold = async(requisitionId: string) => {
  try {
    dispatch(startLoading());
    await holdRequisition(requisitionId);
    enqueueSnackbar('Requisition put on hold', { variant: 'success' });
    // Optionally refetch requisitions or update state directly
    await fetchRequisitions('pending')
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  }
};

export const callPublishRequisition = async(requisitionId:string) => { 
  try{ 
    dispatch(startLoading())
    await publishRequisition(requisitionId)
    enqueueSnackbar('Requisition Published', {variant: 'success'})
    await fetchRequisitions()
  }catch(error:any){ 
    dispatch(hasError(error?.response?.data || error));
  }
}

export const callUnPublishRequisition = async(requisitionId: string, jobListKey:string) => { 
  try{ 
    dispatch(startLoading())
    await unPublishRequisition(requisitionId, jobListKey)
    
  }catch(error:any){ 
    dispatch(hasError(error?.response?.data || error));
  }
}

export default requisitionSlice.reducer;
