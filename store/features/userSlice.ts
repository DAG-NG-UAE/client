import { AppRole, User } from "@/interface/user";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getRecruiters } from "@/api/user";

export interface UserState { 
    recruiters: Partial<User>[]; 
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null; 
}

const initialState: UserState = { 
    recruiters: [], 
    status: 'idle', 
    error: null
}

export const fetchRecruiters = createAsyncThunk('users/fetchRecruiters', async (roleName: string, {rejectWithValue}) => { 
    try{ 
        const response = await getRecruiters(roleName)
        return response
    }catch(error: any){ 
        return rejectWithValue(error.toString())
    }
})

export const userSlice = createSlice({ 
    name: 'users', 
    initialState, 
    reducers: { 
        clearRecruiters: (state) => { 
            state.recruiters = []
        }
    }, 
    extraReducers: (builder) => { 
        builder
        .addCase(fetchRecruiters.pending, (state) => { 
            state.status = 'loading';
        })
        .addCase(fetchRecruiters.fulfilled, (state, action: PayloadAction<Partial<User>[]>) => { 
            state.status = 'succeeded', 
            console.log(`the recruiters are => ${JSON.stringify(action.payload)}`)
            state.recruiters = action.payload;
        })
        .addCase(fetchRecruiters.rejected, (state, action) => { 
            state.status = 'failed'
            state.error = action.payload as string
        })
    }
})

export const setRecruiters = (state: RootState) => state.users.recruiters

export default userSlice.reducer