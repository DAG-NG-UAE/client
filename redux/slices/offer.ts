import {
  Clauses,
  ExtendedClause,
  Guarantor,
  JoiningDetails,
  Offer,
} from "@/interface/offer";
import { PaginationMeta } from "./requisition";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dispatch } from "../dispatchHandle";
import {
  createEmployee,
  getAllClauses,
  getAllOffers,
  getGuarantor,
  getJoiningDetails,
  getOfferById,
  getOfferLetter,
  resolveRequisition,
} from "@/api/offer";
import { enqueueSnackbar } from "notistack";

export interface OfferState {
  masterClauses: Partial<Clauses>[];
  offers: Partial<Offer>[];
  meta: PaginationMeta | null;
  joiningDetails: Partial<JoiningDetails> | null;
  guarantor: Partial<Guarantor> | null;
  currentOffer: Partial<Offer> | null;
  selectedClauses: ExtendedClause[];
  loading: boolean;
  error: string | null;
}

const initialState: OfferState = {
  masterClauses: [],
  offers: [],
  meta: null,
  joiningDetails: null,
  guarantor: null,
  currentOffer: null,
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
      ((state.loading = false), (state.masterClauses = action.payload));
    },
    addSelectedClause(state, action: PayloadAction<ExtendedClause>) {
      if (!state.selectedClauses) state.selectedClauses = [];
      state.selectedClauses.push(action.payload);
    },
    removeSelectedClause(state, action: PayloadAction<string>) {
      if (state.selectedClauses) {
        state.selectedClauses = state.selectedClauses.filter(
          (clause) => clause.instanceId !== action.payload,
        );
      }
    },
    setSelectedClauses(state, action: PayloadAction<ExtendedClause[]>) {
      state.selectedClauses = action.payload;
    },
    setOffers(
      state,
      action: PayloadAction<{ data: Partial<Offer>[]; meta: PaginationMeta }>,
    ) {
      state.loading = false;
      state.offers = action.payload.data || [];
      state.meta = action.payload.meta;
    },
    setCurrentOffer(state, action: PayloadAction<Partial<Offer>>) {
      state.currentOffer = action.payload;
    },
    setJoiningDetails(state, action: PayloadAction<Partial<JoiningDetails>>) {
      state.joiningDetails = action.payload;
    },
    setGuarantor(state, action: PayloadAction<Partial<Guarantor>>) {
      state.guarantor = action.payload;
    },
    clearOfferState(state) {
      state.masterClauses = [];
      state.currentOffer = null;
      state.selectedClauses = [];
      state.joiningDetails = null;
      state.guarantor = null;
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
  setOffers,
  setCurrentOffer,
  setJoiningDetails,
  setGuarantor,
  clearOfferState,
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

export const fetchAllOffers = async (
  status?: string,
  page: number = 1,
  limit: number = 10,
  search?: string,
  requisitionId?: string,
) => {
  try {
    dispatch(startLoading());
    const response = await getAllOffers(
      status,
      page,
      limit,
      search,
      requisitionId,
    );
    dispatch(setOffers(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const fetchOfferById = async (id: string) => {
  try {
    dispatch(startLoading());
    const response = await getOfferById(id);
    dispatch(setCurrentOffer(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const fetchCandidateJoiningDetails = async (id: string) => {
  try {
    dispatch(startLoading());
    const response = await getJoiningDetails(id);
    dispatch(setJoiningDetails(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const fetchGuarantor = async (id: string) => {
  try {
    dispatch(startLoading());
    const response = await getGuarantor(id);
    dispatch(setGuarantor(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const fetchOfferLetter = async (id: string) => {
  try {
    dispatch(startLoading());
    const response = await getOfferLetter(id);
    dispatch(setCurrentOffer(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const callCreateEmployee = async (
  requisitionId: string,
  candidateId: string,
) => {
  try {
    dispatch(startLoading());
    const response = await createEmployee(requisitionId, candidateId);
    enqueueSnackbar('Employee created successfully', { variant: 'success' });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar('Failed to create employee', { variant: 'error' });
  } finally {
    dispatch(stopLoading());
  }
};

export const callResolveRequisition = async (offerId: string) => {
  try {
    dispatch(startLoading());
    const response = await resolveRequisition(offerId);
    enqueueSnackbar('Requisition marked as resolved', { variant: 'success' });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar('Failed to mark requisition as resolved', { variant: 'error' });
  } finally {
    dispatch(stopLoading());
  }
};

export default offerSlice.reducer;
