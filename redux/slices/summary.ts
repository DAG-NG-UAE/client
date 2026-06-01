import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getRequisitionSummary } from "@/api/analytics";
import { dispatch } from "../dispatchHandle";
import { enqueueSnackbar } from "notistack";
import {
    groupRequisitionStats,
    GroupedRequisitionStats,
    RequisitionStatEntry,
} from "@/utils/requisitionStatsGrouping";

export interface SummaryState {
    statsByRequisitionId: Record<string, GroupedRequisitionStats>;
    loadingIds: string[];
    errorIds: string[];
}

const initialState: SummaryState = {
    statsByRequisitionId: {},
    loadingIds: [],
    errorIds: [],
};

export const summarySlice = createSlice({
    name: "summary",
    initialState,
    reducers: {
        startLoadingSummary(state, action: PayloadAction<string>) {
            if (!state.loadingIds.includes(action.payload)) {
                state.loadingIds.push(action.payload);
            }
            state.errorIds = state.errorIds.filter(id => id !== action.payload);
        },
        setSummaryStats(
            state,
            action: PayloadAction<{ requisitionId: string; data: GroupedRequisitionStats }>
        ) {
            const { requisitionId, data } = action.payload;
            state.statsByRequisitionId[requisitionId] = data;
            state.loadingIds = state.loadingIds.filter(id => id !== requisitionId);
        },
        setSummaryError(state, action: PayloadAction<string>) {
            if (!state.errorIds.includes(action.payload)) {
                state.errorIds.push(action.payload);
            }
            state.loadingIds = state.loadingIds.filter(id => id !== action.payload);
        },
        clearSummaryForRequisition(state, action: PayloadAction<string>) {
            delete state.statsByRequisitionId[action.payload];
        },
    },
});

export const {
    startLoadingSummary,
    setSummaryStats,
    setSummaryError,
    clearSummaryForRequisition,
} = summarySlice.actions;

export const fetchRequisitionStats = async (requisitionId: string) => {
    try {
        dispatch(startLoadingSummary(requisitionId));
        const raw: RequisitionStatEntry[] = await getRequisitionSummary(requisitionId);
        const grouped = groupRequisitionStats(raw ?? []);
        dispatch(setSummaryStats({ requisitionId, data: grouped }));
    } catch (error: any) {
        dispatch(setSummaryError(requisitionId));
        enqueueSnackbar("Failed to load requisition stats.", { variant: "error" });
    }
};

export default summarySlice.reducer;
