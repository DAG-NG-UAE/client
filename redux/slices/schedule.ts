import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CandidateProfile } from '@/interface/candidate';

export interface Interviewer {
    displayName: string;
    jobTitle: string;
    avatar?: string;
    email?: string;
    availabilityView?: string;
}

export interface ScheduleState {
    candidate: Partial<CandidateProfile> | null;
    interviewTitle: string;
    date: string;
    duration: number;
    internalInterviewers: Interviewer[];
    step: number;
    startTime: string;
    endTime: string;
    loading: boolean;
    error: string | null;
}

const initialState: ScheduleState = {
    candidate: null,
    interviewTitle: '',
    date: '',
    duration: 60,
    internalInterviewers: [],
    step: 1,
    startTime: '',
    endTime: '',
    loading: false,
    error: null,
};

export const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setCandidate: (state, action: PayloadAction<Partial<CandidateProfile>>) => {
            state.candidate = action.payload;
        },
        setMeetingDetails: (state, action: PayloadAction<{ title?: string, date?: string, duration?: number }>) => {
            if (action.payload.title !== undefined) state.interviewTitle = action.payload.title;
            if (action.payload.date !== undefined) state.date = action.payload.date;
            if (action.payload.duration !== undefined) state.duration = action.payload.duration;
        },
        addInterviewer: (state, action: PayloadAction<Interviewer>) => {
            state.internalInterviewers.push(action.payload);
        },
        updateInterviewer: (state, action: PayloadAction<{ email: string, data: Partial<Interviewer> }>) => {
            const index = state.internalInterviewers.findIndex(int => int.email === action.payload.email);
            if (index !== -1) {
                state.internalInterviewers[index] = { ...state.internalInterviewers[index], ...action.payload.data };
            }
        },
        removeInterviewer: (state, action: PayloadAction<number>) => {
            state.internalInterviewers.splice(action.payload, 1);
        },
        setStep: (state, action: PayloadAction<number>) => {
            state.step = action.payload;
        },
        setTimeSlot: (state, action: PayloadAction<{ startTime: string, endTime: string }>) => {
            state.startTime = action.payload.startTime;
            state.endTime = action.payload.endTime;
        },
        resetSchedule: (state) => {
            return initialState;
        }
    },
});

export const {
    setCandidate,
    setMeetingDetails,
    addInterviewer,
    updateInterviewer,
    removeInterviewer,
    setStep,
    setTimeSlot,
    resetSchedule
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
