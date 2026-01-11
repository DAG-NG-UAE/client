import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getRequisitions,
  getSingleRequisition,
  holdRequisition,
  approveRequisition,
  unPublishRequisition,
  publishRequisition,
  assignRecruiters,
  removeRecruiters,
  addRequisitionLocation,
  updateRequisitionLocation,
  removeRequisitionLocation,
  updateRequisition,
  createRequisition,
} from "@/api/requisitionApi";
import { RecruiterSelection, Requisition } from "@/interface/requisition";
import { dispatch } from "../dispatchHandle";
import { enqueueSnackbar } from "notistack";

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
  name: "requisitions",
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
    setSelectedRequisition: (
      state,
      action: PayloadAction<Partial<Requisition>>
    ) => {
      state.loading = false;
      state.selectedRequisition = {
        ...state.selectedRequisition,
        ...action.payload,
      };
    },
    clearSelectedRequisition: (state) => {
      state.selectedRequisition = null;
    },
    clearError(state) {
      state.error = null;
    },
    stopLoading(state) {
      state.loading = false;
    },
    clearRequisition(state) {
      state.requisitions = [];
      state.selectedRequisition = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  setRequisitions,
  setSelectedRequisition,
  clearSelectedRequisition,
  clearError,
  stopLoading,
  clearRequisition,
} = requisitionSlice.actions;

export const fetchRequisitions = async (status?: string) => {
  try {
    dispatch(startLoading());
    const response = await getRequisitions(status);
    dispatch(setRequisitions(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  }
};

export const fetchRequisitionById = async (id: string) => {
  try {
    dispatch(startLoading());
    const response = await getSingleRequisition(id);
    dispatch(setSelectedRequisition(response));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  }
};

export const handleApproveRequisition = async ({
  recruiters,
  requisitionId,
  recruiterEmails,
}: {
  recruiters: RecruiterSelection[];
  requisitionId: string;
  recruiterEmails: string;
}) => {
  try {
    dispatch(startLoading());
    await approveRequisition(recruiters, requisitionId, recruiterEmails);
    await fetchRequisitions("pending");
    enqueueSnackbar("Requisition has been approved", { variant: "success" });
    // Optionally refetch requisitions or update state directly
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  }
};

export const putRequisitionOnHold = async (requisitionId: string) => {
  try {
    dispatch(startLoading());
    await holdRequisition(requisitionId);
    enqueueSnackbar("Requisition put on hold", { variant: "success" });
    // Optionally refetch requisitions or update state directly
    await fetchRequisitions("pending");
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  }
};

export const callPublishRequisition = async (requisitionId: string) => {
  try {
    dispatch(startLoading());
    await publishRequisition(requisitionId);
    await fetchRequisitionById(requisitionId);
    enqueueSnackbar("Job Posted on Careers page", { variant: "success" });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(clearError());
    dispatch(stopLoading());
  }
};

export const callUnPublishRequisition = async (
  requisitionId: string,
  jobListKey: string
) => {
  try {
    dispatch(startLoading());
    await unPublishRequisition(requisitionId, jobListKey);
    await fetchRequisitionById(requisitionId);
    enqueueSnackbar("Job Taken down from Careers page", { variant: "success" });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(clearError());
    dispatch(stopLoading());
  }
};

export const callAssignRecruiters = async (
  requisitionId: string,
  recruiters: { userId: string; roleId: string }[],
  recruiterEmails: string
) => {
  try {
    dispatch(startLoading());
    await assignRecruiters(requisitionId, recruiters, recruiterEmails);
    await fetchRequisitionById(requisitionId);
    enqueueSnackbar("Recruiters assigned", { variant: "success" });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(clearError());
    dispatch(stopLoading());
  }
};

export const callRemoveRecruiters = async (
  requisitionId: string,
  userId: string,
  recruiterEmail: string
) => {
  try {
    dispatch(startLoading());
    await removeRecruiters(requisitionId, userId, recruiterEmail);
    // we want to fetch the requisition and then we want to update the selected requisition
    await fetchRequisitionById(requisitionId);
    enqueueSnackbar("Recruiter removed ", { variant: "success" });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(clearError());
    dispatch(stopLoading());
  }
};

export const callAddRequisitionLocation = async (
  requisitionId: string,
  location: string,
  headCount: number
) => {
  try {
    dispatch(startLoading());
    await addRequisitionLocation(requisitionId, location, headCount);
    await fetchRequisitionById(requisitionId);
    enqueueSnackbar("Location added successfully", { variant: "success" });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(clearError());
    dispatch(stopLoading());
  }
};

export const callUpdateRequisitionLocation = async (
  requisitionId: string,
  positionSlotId: string,
  location: string,
  headCount: number
) => {
  try {
    dispatch(startLoading());
    await updateRequisitionLocation(
      requisitionId,
      positionSlotId,
      location,
      headCount
    );
    await fetchRequisitionById(requisitionId);
    enqueueSnackbar("Location updated successfully", { variant: "success" });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(clearError());
    dispatch(stopLoading());
  }
};

export const callDeleteRequisitionLocation = async (
  requisitionId: string,
  positionSlotId: string,
  location: string
) => {
  try {
    dispatch(startLoading());
    await removeRequisitionLocation(requisitionId, positionSlotId, location);
    await fetchRequisitionById(requisitionId);
    enqueueSnackbar(
      "Location marked as in active and removed from the careers page",
      { variant: "success" }
    );
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(clearError());
    dispatch(stopLoading());
  }
};

export const saveJobDescription = async (
  requisitionId: string,
  data: Partial<Requisition>
) => {
  try {
    dispatch(startLoading());
    await updateRequisition(requisitionId, data);
    await fetchRequisitionById(requisitionId);
    enqueueSnackbar("Job description saved successfully", {
      variant: "success",
    });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(clearError());
    dispatch(stopLoading());
  }
};

export const callCreateRequisition = async (
  requisition: Partial<Requisition>
) => {
  try {
    dispatch(startLoading());
    await createRequisition(requisition);
    enqueueSnackbar("Talent Request sent successfully", { variant: "success" });
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(clearError());
    dispatch(stopLoading());
  }
};

export default requisitionSlice.reducer;
