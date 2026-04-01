import {
  Clauses,
  ExtendedClause,
  Guarantor,
  JoiningDetails,
  Offer,
  PreOfferDocument,
  SavePreOfferDocsRequest,
  InternalSalaryOffer,
  SendInternalOfferRequest,
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
  savePreOfferDocs,
  sendPreOfferNotification,
  fetchPreOfferDocs,
  fetchInternalSalaryOffer,
  sendInternalSalaryOffer,
  updateInternalSalaryProposal,
  updateJoiningDocsStatus,
  updatePreOfferDocStatus,
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
  preOfferDocs: PreOfferDocument[];
  preOfferToken: string | null;
  internalOffer: Partial<InternalSalaryOffer> | null;
  internalOffersHistory: Partial<InternalSalaryOffer>[];
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
  preOfferDocs: [],
  preOfferToken: null,
  internalOffer: null,
  internalOffersHistory: [],
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
    setPreOfferDocs(state, action: PayloadAction<{ docs: PreOfferDocument[], token: string | null }>) {
      state.preOfferDocs = action.payload.docs || [];
      state.preOfferToken = action.payload.token || null;
    },
    setInternalOffer(
      state,
      action: PayloadAction<Partial<InternalSalaryOffer> | null>,
    ) {
      state.internalOffer = action.payload;
    },
    setInternalOffersHistory(
      state,
      action: PayloadAction<Partial<InternalSalaryOffer>[]>,
    ) {
      state.internalOffersHistory = action.payload;
    },
    clearOfferState(state) {
      state.masterClauses = [];
      state.currentOffer = null;
      state.selectedClauses = [];
      state.joiningDetails = null;
      state.guarantor = null;
      state.error = null;
      state.loading = false;
      state.preOfferDocs = [];
      state.preOfferToken = null;
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
  setPreOfferDocs,
  setInternalOffer,
  setInternalOffersHistory,
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
    enqueueSnackbar("Failed to load clauses. Please try again.", { variant: "error" });
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
    enqueueSnackbar("Failed to load offers. Please try again.", { variant: "error" });
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
    enqueueSnackbar("Failed to load offer. Please try again.", { variant: "error" });
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
    enqueueSnackbar("Failed to load joining details. Please try again.", { variant: "error" });
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
    enqueueSnackbar("Failed to load guarantor details. Please try again.", { variant: "error" });
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
    enqueueSnackbar("Failed to load offer letter. Please try again.", { variant: "error" });
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
    enqueueSnackbar("Employee created successfully", { variant: "success" });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar("Failed to create employee", { variant: "error" });
  } finally {
    dispatch(stopLoading());
  }
};

export const callResolveRequisition = async (offerId: string) => {
  try {
    dispatch(startLoading());
    const response = await resolveRequisition(offerId);
    enqueueSnackbar("Requisition marked as resolved", { variant: "success" });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar("Failed to mark requisition as resolved", {
      variant: "error",
    });
  } finally {
    dispatch(stopLoading());
  }
};

export const callSavePreOfferDocs = async (
  payload: SavePreOfferDocsRequest,
) => {
  try {
    dispatch(startLoading());
    await savePreOfferDocs(payload);
    enqueueSnackbar("Pre-offer documents saved", { variant: "success" });
    await callFetchPreOfferDocs(payload.candidateId);
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar(
      error?.response?.data?.message || "Failed to save pre-offer docs",
      { variant: "error" },
    );
  } finally {
    dispatch(stopLoading());
  }
};

export const callFetchPreOfferDocs = async (candidateId: string) => {
  try {
    dispatch(startLoading());
    const response = await fetchPreOfferDocs(candidateId);
    if (response.success) {
      // Handle both cases: old array structure and new object structure
      if (Array.isArray(response.data)) {
        dispatch(setPreOfferDocs({ docs: response.data, token: null }));
      } else {
        dispatch(setPreOfferDocs({
          docs: response.data.pre_offer_requested_docs || [],
          token: response.data.token || null
        }));
      }
    }
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar("Failed to load pre-offer documents. Please try again.", { variant: "error" });
  } finally {
    dispatch(stopLoading());
  }
};

export const callFetchInternalSalaryOffer = async (candidateId: string) => {
  try {
    dispatch(startLoading());
    const response = await fetchInternalSalaryOffer(candidateId);
    if (response.success && response.data && response.data.length > 0) {
      dispatch(setInternalOffer(response.data[0]));
      dispatch(setInternalOffersHistory(response.data));
    } else {
      dispatch(setInternalOffer(null));
      dispatch(setInternalOffersHistory([]));
    }
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    dispatch(setInternalOffer(null));
    dispatch(setInternalOffersHistory([]));
    enqueueSnackbar("Failed to load salary offer. Please try again.", { variant: "error" });
  } finally {
    dispatch(stopLoading());
  }
};

export const callSendInternalSalaryOffer = async (
  payload: SendInternalOfferRequest,
) => {
  try {
    dispatch(startLoading());
    await sendInternalSalaryOffer(payload);
    enqueueSnackbar("Internal offer sent for approval", { variant: "success" });
    await callFetchInternalSalaryOffer(payload.candidateId);
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar(error?.response?.data?.message || "Failed to send offer", {
      variant: "error",
    });
  } finally {
    dispatch(stopLoading());
  }
};

export const callUpdateJoiningDocsStatus = async (
  documentId: string,
  status: string,
  comment: string,
  offerId: string,
  category: string,
) => {
  try {
    dispatch(startLoading());
    await updateJoiningDocsStatus(documentId, status, comment, category);
    enqueueSnackbar("Joining documents status updated", { variant: "success" });
    await fetchOfferById(offerId);
    await fetchCandidateJoiningDetails(offerId);
    await fetchGuarantor(offerId);
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar(
      error?.response?.data?.message || "Failed to update joining docs status",
      {
        variant: "error",
      },
    );
  } finally {
    dispatch(stopLoading());
  }
};

export const callSendPreOfferDocs = async (payload: {
  candidateId: string;
  requisitionId?: string;
  requestedDocs: { displayName: string }[];
  link: string;
}) => {
  try {
    dispatch(startLoading());
    const docNames = payload.requestedDocs.map((d) => d.displayName);
    await sendPreOfferNotification(payload.candidateId, docNames, payload.link);
    enqueueSnackbar("Document request sent to candidate", { variant: "success" });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data?.message || error));
    enqueueSnackbar(
      error?.response?.data?.message || "Failed to send document request",
      { variant: "error" },
    );
  } finally {
    dispatch(stopLoading());
  }
};

export const callUpdatePreOfferDocStatus = async (
  documentId: string,
  status: string,
  candidateId: string,
  docUrl: string,
) => {
  try {
    dispatch(startLoading());
    await updatePreOfferDocStatus(documentId, status, candidateId, docUrl);
    enqueueSnackbar(`Document ${status} successfully`, { variant: "success" });
    await callFetchPreOfferDocs(candidateId);
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar(
      error?.response?.data?.message || "Failed to update document status",
      { variant: "error" },
    );
  } finally {
    dispatch(stopLoading());
  }
};

export default offerSlice.reducer;
