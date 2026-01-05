import { Clauses, ExtendedClause } from "@/interface/offer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dispatch } from "../dispatchHandle";
import { getAllClauses } from "@/api/offer";

export interface OfferState {
  masterClauses: Partial<Clauses>[];
  selectedClauses: ExtendedClause[];
  loading: boolean;
  error: string | null;
}

const initialState: OfferState = {
  masterClauses: [],
  selectedClauses: [],
  loading: false,
  error: null,
};

export const offerSlice = createSlice({
  name: "offers",
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
    setMasterClauses(state, action: PayloadAction<Partial<Clauses>[]>) {
      (state.loading = false), (state.masterClauses = action.payload);
    },
    addSelectedClause(state, action: PayloadAction<ExtendedClause>) {
      if (!state.selectedClauses) state.selectedClauses = [];
      state.selectedClauses.push(action.payload);
    },
    removeSelectedClause(state, action: PayloadAction<string>) {
      if (state.selectedClauses) {
        state.selectedClauses = state.selectedClauses.filter(
          (clause) => clause.instanceId !== action.payload
        );
      }
    },
    setSelectedClauses(state, action: PayloadAction<ExtendedClause[]>) {
      state.selectedClauses = action.payload;
    },
    clearState(state) {
      state.masterClauses = [];
      state.selectedClauses = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  startLoading,
  hasError,
  setMasterClauses,
  addSelectedClause,
  removeSelectedClause,
  setSelectedClauses,
  clearState,
  stopLoading,
} = offerSlice.actions;

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
};

export default offerSlice.reducer;
