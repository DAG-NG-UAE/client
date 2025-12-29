import { AuthState } from "@/interface/user";
import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axiosInstance";
import { dispatch } from "../dispatchHandle";
import { clearSelectedRequisition } from "./requisition";
import { clearSelectedCandidate, clearCandidates, clearError } from "./candidates";
import { clearInterviewState } from "./interview";


// Define the initial state
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: true,
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
        },

        // Fetch user 
        setUser(state, action) { 
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
        },

        setUserLogout(state, action){ 
            console.log('we want to log you out')
            state.loading = false; 
            state.user = null; 
            state.isAuthenticated = false
        }
    }
  })

  export default authSlice.reducer;

export const { 
    setUser,
    setUserLogout,
    startLoading,
    hasError
} = authSlice.actions

export const fetchUsers = async() => { 
    try {
        dispatch(startLoading())
        const response = await axiosInstance.get('/user/me');
        dispatch(setUser(response.data.data.user))
    } catch (error: any) {
        dispatch(hasError(error?.response?.data || error));
    }
}

export const logoutUser = async () => { 
    try{ 
        dispatch(startLoading())
        const response = await axiosInstance.post('/auth/logout');
        dispatch(clearSelectedRequisition())
        dispatch(clearSelectedCandidate())
        dispatch(clearCandidates())
        dispatch(setUserLogout({}))
        dispatch(clearInterviewState())
        dispatch(clearError())
        dispatch(clearInterviewState())
    }catch(error: any){ 
        dispatch(hasError(error?.response?.data || error));
    }
}
