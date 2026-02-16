import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CandidateEvaluationPayload, EvaluationForm } from "@/interface/interview";
import { dispatch } from '../dispatchHandle';
import { getEvaluationForm } from '@/api/interview';
import { enqueueSnackbar } from 'notistack';
import { evaluateCandidate } from '@/api/candidate';
import { fetchAllCandidates } from './candidates';

export interface InterviewState {
    evaluationForm: EvaluationForm[];
    loading: boolean;
    error: string | null;
}

const initialState: InterviewState = {
    evaluationForm: [],
    loading: false,
    error: null,
};

export const interviewSlice = createSlice({
    name: 'interview',
    initialState,
    reducers: {
        startLoading(state) {
            state.loading = true;
        },
        hasError(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        setEvaluationForm(state, action: PayloadAction<EvaluationForm[]>) {
            state.loading = false;
            state.evaluationForm = action.payload;
        },
        clearError(state) {
            state.error = null;
        },
        stopLoading(state) {
            state.loading = false;
        },
        clearInterviewState(state){ 
            state.evaluationForm = []
            state.error = null
        }
    },
});

export const {
    startLoading,
    hasError,
    setEvaluationForm,
    clearError,
    stopLoading,
    clearInterviewState,
} = interviewSlice.actions;

export const fetchEvaluationForm = async (department: string) => {
    try {
        dispatch(startLoading());
        const response = await getEvaluationForm(department);
        dispatch(setEvaluationForm(response));
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'Failed to fetch evaluation form';
        dispatch(hasError(errorMessage));
        enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
        dispatch(stopLoading());
    }
};

export const callInsertCandidateEvaluation = async (evaluation: CandidateEvaluationPayload) => {
    try {
        dispatch(startLoading());
        const response = await evaluateCandidate(evaluation);
        // we want to dispacth the fetch all candidates where the status is pending_feedback
        await fetchAllCandidates(undefined,'pending_feedback');
        enqueueSnackbar('Candidate evaluated successfully', { variant: 'success' });
    } catch (error: any) {
        const errorMessage = error?.response?.data?.message || 'Failed to insert candidate evaluation';
        dispatch(hasError(errorMessage));
        enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
        dispatch(stopLoading());
    }
};
export default interviewSlice.reducer;
