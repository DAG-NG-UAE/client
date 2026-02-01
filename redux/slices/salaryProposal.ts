import { VerifyInternalSalaryOfferResponse } from "@/interface/offer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dispatch } from "../dispatchHandle";
import { approvedInternalSalaryProposal, updateInternalSalaryProposal, verifyInternalSalaryToken } from "@/api/offer";

export interface SalaryProposal {
    proposalData: VerifyInternalSalaryOfferResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: SalaryProposal = {
    proposalData: null,
    loading: false,
    error: null,
}

const salaryProposalSlice = createSlice({
    name: "salaryProposals",
    initialState,
    reducers: {
        startLoading(state) {
            state.loading = true;
        },
        hasError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        stopLoading(state) {
            state.loading = false;
        },
        setProposalData(state, action: PayloadAction<VerifyInternalSalaryOfferResponse>) {
            state.proposalData = action.payload;
        },
    },
});

export const { startLoading, hasError, stopLoading, setProposalData } = salaryProposalSlice.actions;

export const fetchSalaryProposal = async (token: string) =>{
    try{ 
        startLoading();
        const response = await verifyInternalSalaryToken(token)
        dispatch(setProposalData(response.data))
    }catch(error: any){ 
        dispatch(hasError(error?.response?.data || error));
    }finally{
        dispatch(stopLoading());
    }
}

export const updateSalaryProposal = async (approvalIds: string[], candidateId: string, status: string, token: string) =>{
    try{ 
        startLoading();
        const response = await updateInternalSalaryProposal(approvalIds, candidateId, status)
        fetchSalaryProposal(token)
    }catch(error: any){ 
        dispatch(hasError(error?.response?.data || error));
    }finally{
        dispatch(stopLoading());
    }
}

export const fetchApprovedSalaryProposalForCandidate = async (candidateId: string) =>{
    try{ 
        startLoading();
        const response = await approvedInternalSalaryProposal(candidateId)
        dispatch(setProposalData(response.data[0]))
    }catch(error: any){ 
        dispatch(hasError(error?.response?.data || error));
    }finally{
        dispatch(stopLoading());
    }
}

export default salaryProposalSlice.reducer;
