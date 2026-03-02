import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CandidateEvaluationPayload,
  CandidateProfile,
  CandidateEvaluationSession,
} from "@/interface/candidate";
import {
  getAllCandidates,
  getCandidatesForRequisition,
  getSingleCandidate,
  updateCandidateStatus,
  scheduleInterview,
  getCandidateTotalEvaluation,
  getCandidateEvaluationDetails,
} from "@/api/candidate";
import { dispatch } from "../dispatchHandle";
import { enqueueSnackbar } from "notistack";
import { PaginationMeta } from "./requisition";
import { resetSchedule } from "./schedule";

export interface CandidateState {
  candidates: Partial<CandidateProfile>[];
  meta: PaginationMeta | null;
  selectedCandidate: Partial<CandidateProfile> | null;
  candidateTotalEvaluation: CandidateEvaluationPayload[] | null;
  candidateEvaluationDetails: CandidateEvaluationSession[] | null;
  loading: boolean;
  error: string | null;
}

const initialState: CandidateState = {
  candidates: [],
  meta: null,
  selectedCandidate: null,
  candidateTotalEvaluation: null,
  candidateEvaluationDetails: null,
  loading: false,
  error: null,
};

export const candidateSlice = createSlice({
  name: "candidates",
  initialState,
  reducers: {
    startLoading(state) {
      state.loading = true;
    },
    hasError(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setCandidates(
      state,
      action: PayloadAction<{
        data: Partial<CandidateProfile>[];
        meta: PaginationMeta;
      }>,
    ) {
      state.loading = false;
      state.candidates = action.payload.data || [];
      state.meta = action.payload.meta;
    },
    setSelectedCandidate: (
      state,
      action: PayloadAction<Partial<CandidateProfile>>,
    ) => {
      state.loading = false;
      state.selectedCandidate = {
        ...state.selectedCandidate,
        ...action.payload,
      };
    },
    setCandidateTotalEvaluation: (
      state,
      action: PayloadAction<CandidateEvaluationPayload[]>,
    ) => {
      state.loading = false;
      state.candidateTotalEvaluation = action.payload;
    },
    setCandidateEvaluationDetails: (
      state,
      action: PayloadAction<CandidateEvaluationSession[]>,
    ) => {
      state.loading = false;
      state.candidateEvaluationDetails = action.payload;
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
      state.selectedCandidate = null;
      state.candidateTotalEvaluation = null;
      state.candidateEvaluationDetails = null;
      state.error = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  setCandidates,
  setSelectedCandidate,
  setCandidateTotalEvaluation,
  setCandidateEvaluationDetails,
  clearSelectedCandidate,
  clearError,
  stopLoading,
  clearCandidates,
} = candidateSlice.actions;

export const fetchAllCandidates = async (
  requisitionId?: string,
  status?: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
) => {
  try {
    dispatch(startLoading());
    const response = await getAllCandidates(
      requisitionId,
      status,
      page,
      limit,
      search,
    );
    console.log(
      `in the candidate slice I called the get all candidates => ${JSON.stringify(response)}`,
    );
    dispatch(setCandidates(response));
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

export const callUpdateCandidateStatus = async (
  updateData: Partial<CandidateProfile> & { emailTemplateId?: number },
) => {
  try {
    dispatch(startLoading());
    await updateCandidateStatus(updateData);
    enqueueSnackbar("Candidate status updated", { variant: "success" });
    dispatch(stopLoading());
    // Optionally refetch candidates or update state directly
    // fetchAllCandidates(undefined, "applied");
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const callScheduleInterview = async (interviewData: {
  candidate_id: string;
  candidate_name: string;
  requisition_id: string;
  interview_phase: string;
  interview_date: string;
  duration_minutes: number;
  location_type: 'online' | 'in_person';
  location_details: string;
  interview_panel: string[];
  old_status: string;
  publicCvLink: string;
  body: string;
  candidateEmail: string;
  subject: string;
}) => {
  try {
    dispatch(startLoading());
    await scheduleInterview(interviewData);
    enqueueSnackbar("Interview scheduled successfully", { variant: "success" });
    //clear the schedule state entirely 
    dispatch(resetSchedule());
    fetchAllCandidates(undefined, "shortlisted");
    dispatch(stopLoading());
  } catch (error: any) {
    dispatch(hasError(error?.response?.data?.message || error?.message || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const callGetCandidateTotalEvaluation = async (candidateId: string) => {
  try {
    dispatch(startLoading());
    const response = await getCandidateTotalEvaluation(candidateId);
    dispatch(setCandidateTotalEvaluation(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const callGetCandidateEvaluationDetails = async (
  candidateId: string,
) => {
  try {
    dispatch(startLoading());
    const response = await getCandidateEvaluationDetails(candidateId);
    dispatch(setCandidateEvaluationDetails(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export default candidateSlice.reducer;
