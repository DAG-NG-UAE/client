import { AuthState } from "@/interface/user";
import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";
import { dispatch } from "../dispatchHandle";
import { clearSelectedRequisition } from "./requisition";
import { clearSelectedCandidate, clearCandidates, clearError } from "./candidates";
import { clearInterviewState } from "./interview";
import { clearRequisition } from "./requisition";
import { clearOfferState } from "./offer";
import { resetSchedule } from "./schedule";

// Define the initial state
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    isLoggingIn: false,
    isLoggingOut: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // START LOADING
        startLoading(state) {
            state.loading = true;
        },

        // HAS ERROR
        hasError(state, action) {
            state.loading = false;
            state.error = action.payload;
            state.isLoggingIn = false;
            state.isLoggingOut = false;
        },

        // Fetch user 
        setUser(state, action) {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoggingIn = false;
            state.isLoggingOut = false;
        },

        setUserLogout(state, action) {
            console.log('we want to log you out')
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.isLoggingIn = false;
            state.isLoggingOut = false;
        },

        setIsLoggingIn(state, action) {
            state.isLoggingIn = action.payload;
        },
        setIsLoggingOut(state, action) {
            state.isLoggingOut = action.payload;
        }
    }
})

export default authSlice.reducer;

export const {
    setUser,
    setUserLogout,
    startLoading,
    hasError,
    setIsLoggingIn,
    setIsLoggingOut
} = authSlice.actions;

export const fetchUsers = async () => {
    try {
        dispatch(startLoading())
        const response = await axiosInstance.get('/user/me');
        dispatch(setUser(response.data.data.user))
    } catch (error: any) {
        dispatch(hasError(error?.response?.data || error));
    }
}

export const logoutUser = async () => {
    try {
        dispatch(setIsLoggingOut(true))
        const response = await axiosInstance.post('/auth/logout');
        // Add a small delay so the user can see the "Sad to see you go" message
        await new Promise(resolve => setTimeout(resolve, 1500));
        dispatch(clearSelectedRequisition())
        dispatch(clearSelectedCandidate())
        dispatch(clearCandidates())
        dispatch(setUserLogout({}))
        dispatch(clearInterviewState())
        dispatch(clearError())
        dispatch(clearInterviewState())
        dispatch(clearRequisition())
        dispatch(clearOfferState())
        dispatch(resetSchedule())
    } catch (error: any) {
        dispatch(hasError(error?.response?.data || error));
    }
}
