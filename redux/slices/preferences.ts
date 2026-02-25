import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    getAdminPreferences,
    getSinglePreference,
    getSkillsByPrefKey,
    deleteSkill,
    addSkill,
    updateSkill,
    getOptionValues,
    addOptionValue,
    updateOptionValue,
    createPreference
} from '@/api/preference';
import { Preference, PreferenceMeta, PreferenceDetail, RankingOption } from '@/interface/preference';
import { dispatch } from "../dispatchHandle";

export interface PreferencesState {
    preferences: Preference[];
    selectedPreferenceDetail: PreferenceDetail[] | null;
    rankingOptions: RankingOption[];
    meta: PreferenceMeta | null;
    loading: boolean;
    error: string | null;
}

const initialState: PreferencesState = {
    preferences: [],
    selectedPreferenceDetail: null,
    rankingOptions: [],
    meta: null,
    loading: false,
    error: null,
};

export const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        startLoading(state) {
            state.loading = true;
            state.error = null;
        },
        hasError(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
        },
        setPreferences(state, action: PayloadAction<{ data: Preference[], meta: PreferenceMeta }>) {
            state.loading = false;
            state.preferences = action.payload.data;
            state.meta = action.payload.meta;
        },
        setSelectedPreferenceDetail(state, action: PayloadAction<PreferenceDetail[] | null>) {
            state.loading = false;
            state.selectedPreferenceDetail = action.payload;
        },
        setRankingOptions(state, action: PayloadAction<RankingOption[]>) {
            state.loading = false;
            state.rankingOptions = action.payload;
        }
    },
});

export const {
    startLoading,
    hasError,
    setPreferences,
    setSelectedPreferenceDetail,
    setRankingOptions
} = preferencesSlice.actions;

export const fetchAdminPreferences = async (page: number, limit: number, search = "") => {
    try {
        dispatch(startLoading());
        const response = await getAdminPreferences(page, limit, search);
        dispatch(setPreferences(response));
    } catch (error: any) {
        dispatch(hasError(error?.response?.data?.message || error.message || "Failed to fetch preferences"));
    }
};

export const fetchSinglePreference = async (prefKey: string) => {
    try {
        dispatch(startLoading());
        const response = await getSinglePreference(prefKey);
        dispatch(setSelectedPreferenceDetail(response));
        // Also fetch options
        const options = await getOptionValues(prefKey);
        dispatch(setRankingOptions(options));
    } catch (error: any) {
        dispatch(hasError(error?.response?.data?.message || error.message || "Failed to fetch preference detail"));
    }
}

export const fetchRankingOptions = async (prefKey: string) => {
    try {
        dispatch(startLoading());
        const response = await getOptionValues(prefKey);
        dispatch(setRankingOptions(response));
    } catch (error: any) {
        dispatch(hasError(error?.response?.data?.message || error.message || "Failed to fetch ranking options"));
    }
}

export const fetchSkillsByPrefKey = async (prefKey: string) => {
    try {
        dispatch(startLoading());
        const response = await getSkillsByPrefKey(prefKey);
        const fullDetail = await getSinglePreference(prefKey);
        dispatch(setSelectedPreferenceDetail(fullDetail));
    } catch (error: any) {
        dispatch(hasError(error?.response?.data?.message || error.message || "Failed to refresh skills"));
    }
}

export const createPreferenceAction = async (data: { label: string, field_type: string, category: string }) => {
    try {
        dispatch(startLoading());
        await createPreference(data);
        await fetchAdminPreferences(1, 10);
    } catch (error: any) {
        const errorMsg = error?.response?.data?.message || error.message || "Failed to create preference";
        dispatch(hasError(errorMsg));
        throw error;
    }
}

export const deleteSkillAction = async (skillId: number | string, prefKey: string) => {
    try {
        dispatch(startLoading());
        await deleteSkill(skillId, prefKey);
        await fetchSkillsByPrefKey(prefKey);
    } catch (error: any) {
        dispatch(hasError(error?.response?.data?.message || error.message || "Failed to delete skill"));
        throw error;
    }
}

export const addSkillAction = async (prefKey: string, skillName: string) => {
    try {
        dispatch(startLoading());
        await addSkill(prefKey, skillName);
        await fetchSkillsByPrefKey(prefKey);
    } catch (error: any) {
        const errorMsg = error?.response?.data?.message || error.message || "Failed to add skill";
        dispatch(hasError(errorMsg));
        throw error;
    }
}

export const updateSkillAction = async (prefKey: string, skillId: number | string, skillName: string) => {
    try {
        dispatch(startLoading());
        await updateSkill(prefKey, skillId, skillName);
        await fetchSkillsByPrefKey(prefKey);
    } catch (error: any) {
        const errorMsg = error?.response?.data?.message || error.message || "Failed to update skill";
        dispatch(hasError(errorMsg));
        throw error;
    }
}

export const addOptionValueAction = async (prefKey: string, optionName: string) => {
    try {
        dispatch(startLoading());
        await addOptionValue(prefKey, optionName);
        await fetchRankingOptions(prefKey);
    } catch (error: any) {
        const errorMsg = error?.response?.data?.message || error.message || "Failed to add option value";
        dispatch(hasError(errorMsg));
        throw error;
    }
}

export const updateOptionValueAction = async (prefKey: string, optionId: number | string, optionName: string) => {
    try {
        dispatch(startLoading());
        await updateOptionValue(prefKey, optionId, optionName);
        await fetchRankingOptions(prefKey);
    } catch (error: any) {
        const errorMsg = error?.response?.data?.message || error.message || "Failed to update option value";
        dispatch(hasError(errorMsg));
        throw error;
    }
}

export default preferencesSlice.reducer;
