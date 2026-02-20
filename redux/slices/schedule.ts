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
    locationType: 'online' | 'in_person';
    locationDetails: string;
    candidateEmailBody: string;
    interviewerContext: string;
    isEditingPreview: boolean;
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
    locationType: 'online',
    locationDetails: '',
    candidateEmailBody: '',
    interviewerContext: 'Final stage technical and cultural fit interview. Focus on core competencies and stakeholder management.',
    isEditingPreview: false,
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
        setLocation: (state, action: PayloadAction<{ type: 'online' | 'in_person', details?: string }>) => {
            state.locationType = action.payload.type;
            if (action.payload.details !== undefined) state.locationDetails = action.payload.details;
        },
        setEmailCustomization: (state, action: PayloadAction<{ emailBody?: string, context?: string }>) => {
            if (action.payload.emailBody !== undefined) state.candidateEmailBody = action.payload.emailBody;
            if (action.payload.context !== undefined) state.interviewerContext = action.payload.context;
        },
        setEditPreview: (state, action: PayloadAction<boolean>) => {
            state.isEditingPreview = action.payload;
        },
        resetSchedule: (state) => {
            state.candidate = null
            state.internalInterviewers = []
            state.date = ''
            state.duration = 60
            state.startTime = ''
            state.endTime = ''
            state.locationType = 'online'
            state.locationDetails = ''
            state.candidateEmailBody = ''
            state.interviewerContext = 'Final stage technical and cultural fit interview. Focus on core competencies and stakeholder management.'
            state.isEditingPreview = false
            state.loading = false
            state.error = null
            state.step = 1
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
    setLocation,
    setEmailCustomization,
    setEditPreview,
    resetSchedule
} = scheduleSlice.actions;

export default scheduleSlice.reducer;
