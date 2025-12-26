import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  getAllCandidates,
  getCandidatesForRequisition,
  getSingleCandidate,
  updateCandidateStatus,
  scheduleInterview,
} from '@/api/candidate';
import { CandidateProfile } from '@/interface/candidate';
import { dispatch } from '../dispatchHandle';
import { enqueueSnackbar } from 'notistack';

export interface CandidateState {
  candidates: Partial<CandidateProfile>[];
  selectedCandidate: Partial<CandidateProfile> | null;
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  candidates: [],
  selectedCandidate: null,
  loading: false,
  error: null,
};

export const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    hasError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setCandidates(state, action: PayloadAction<Partial<CandidateProfile>[]>) {
      state.loading = false;
      state.candidates = action.payload;
    },
    setSelectedCandidate: (state, action: PayloadAction<Partial<CandidateProfile>>) => {
      state.loading = false;
      state.selectedCandidate = { ...state.selectedCandidate, ...action.payload };
    },
    clearSelectedCandidate: (state) => {
      state.selectedCandidate = null;
    },
    clearError(state) {
      state.error = null;
    },
    stopLoading(state) {
      state.loading = false;
    },
    clearCandidates(state) {
      state.candidates = [];
    }
  },
});

export const {
  startLoading,
  hasError,
  setCandidates,
  setSelectedCandidate,
  clearSelectedCandidate,
  clearError,
  stopLoading,
  clearCandidates,
} = candidateSlice.actions;

export const fetchAllCandidates = async (requisitionId?: string, status?: string) => {
  try {
    dispatch(startLoading());
    const response = await getAllCandidates(requisitionId, status);
    console.log(`in the candidate slice I called the get all candidates => ${JSON.stringify(response.mainResult)}`)
    dispatch(setCandidates(response.mainResult));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const fetchCandidatesForRequisition = async (requisitionId: string) => {
  try {
    dispatch(startLoading());
    const response = await getCandidatesForRequisition(requisitionId);
    dispatch(setCandidates(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const fetchSingleCandidate = async (candidateId: string) => {
  try {
    dispatch(startLoading());
    const response = await getSingleCandidate(candidateId);
    dispatch(setSelectedCandidate(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const callUpdateCandidateStatus = async (updateData: Partial<CandidateProfile>) => {
  try {
    dispatch(startLoading());
    await updateCandidateStatus(updateData);
    enqueueSnackbar('Candidate status updated', { variant: 'success' });
    dispatch(stopLoading());
    // Optionally refetch candidates or update state directly
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const callScheduleInterview = async (
  interviewData: {
    candidate_id: string;
    requisition_id: string;
    current_status: string;
    interview_date: string;
    interview_time: string;
    interview_type: string;
    // interview_panel: string[];
  },
) => {
  try {
    dispatch(startLoading());
    await scheduleInterview(interviewData);
    enqueueSnackbar('Interview scheduled successfully', { variant: 'success' });
    dispatch(stopLoading());
    // Optionally refetch candidate or update state directly
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export default candidateSlice.reducer;

