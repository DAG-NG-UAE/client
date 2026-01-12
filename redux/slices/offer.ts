import {
  Clauses,
  ExtendedClause,
  Guarantor,
  JoiningDetails,
  Offer,
} from "@/interface/offer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dispatch } from "../dispatchHandle";
import {
  getAllClauses,
  getAllOffers,
  getGuarantor,
  getJoiningDetails,
  getOfferById,
  getOfferLetter,
} from "@/api/offer";

export interface OfferState {
  masterClauses: Partial<Clauses>[];
  offers: Partial<Offer>[];
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
    setOffers(state, action: PayloadAction<Partial<Offer>[]>) {
      state.offers = action.payload;
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

export const fetchAllOffers = async (status?: string) => {
  try {
    dispatch(startLoading());
    const response = await getAllOffers(status);
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

export default offerSlice.reducer;
