
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getRecruiters } from "@/api/user";
import { dispatch } from "../dispatchHandle";
import { User } from "@/interface/user";

export interface UserState { 
    recruiters: Partial<User>[]; 
    loading: boolean;
    error: string | null; 
}

const initialState: UserState = { 
    recruiters: [], 
    loading: false, 
    error: null
}

export const userSlice = createSlice({ 
    name: 'users', 
    initialState, 
    reducers: { 
        startLoading(state) {
            state.loading = true;
        },
        hasError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        setRecruiters(state, action: PayloadAction<Partial<User>[]>) {
            state.loading = false;
            state.recruiters = action.payload;
        },
        clearRecruiters: (state) => { 
            state.recruiters = []
        }
    }
})

export const { 
    startLoading,
    hasError,
    setRecruiters,
    clearRecruiters
} = userSlice.actions;

export const fetchRecruiters = async ( roleName: string) => {
    try {
        dispatch(startLoading());
        const response = await getRecruiters(roleName);
        dispatch(setRecruiters(response));
    } catch (error: any) {
        dispatch(hasError(error?.response?.data || error));
    }
};

export default userSlice.reducer;