import { Clauses } from "@/interface/offer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dispatch } from "../dispatchHandle";
import { getAllClauses } from "@/api/offer";

export interface OfferState{ 
    masterClauses: Partial<Clauses>[]
    loading: boolean; 
    error: string | null 
}

const initialState: OfferState = { 
    masterClauses: [], 
    loading: false, 
    error: null 
}

export const offerSlice = createSlice({ 
    name: 'offers', 
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
        setMasterClauses(state, action: PayloadAction<Partial<Clauses>[]>){ 
            state.loading = false, 
            state.masterClauses = action.payload
        }, 
        clearState(state) { 
            state.masterClauses = []
            state.error = null
            state.loading = false
        }
    }
})

export const { 
    startLoading, 
    hasError, 
    setMasterClauses, 
    clearState, 
    stopLoading
} = offerSlice.actions

export const fetchMasterClauses = async () => { 
    try {
        dispatch(startLoading());
        const response = await getAllClauses();
        dispatch(setMasterClauses(response));
    } catch (error: any) {
        dispatch(hasError(error?.response?.data || error));
    } finally {
        dispatch(stopLoading());
    }
}

export default offerSlice.reducer