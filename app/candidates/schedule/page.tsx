"use strict";
"use client";

import React, { useEffect } from 'react';
import {
    Box, Typography, Button, Stack, Switch, FormControlLabel, useTheme
} from '@mui/material';
import {
    ArrowForwardIos, WhatsApp, CheckCircle
} from '@mui/icons-material';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSingleCandidate } from '@/api/candidate';
import { useDispatch, useSelector } from '@/redux/store';
import { setCandidate, setStep } from '@/redux/slices/schedule';
import { callScheduleInterview } from '@/redux/slices/candidates';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';

// New specialized components
import { ScheduleSidebar } from '@/components/candidates/schedule/Sidebar';
import { CalendarHeader } from '@/components/candidates/schedule/CalendarHeader';
import { CalendarGrid } from '@/components/candidates/schedule/CalendarGrid';
import { ReviewAndConfirm } from '@/components/candidates/schedule/ReviewAndConfirm';

export default function SchedulePage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const searchParams = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();

    const candidateId = searchParams.get('id');
    const requisitionId = searchParams.get('reqId');

    const {
        candidate, step, date, interviewTitle, startTime, endTime,
        internalInterviewers, duration, locationType, locationDetails,
        candidateEmailBody, interviewerContext
    } = useSelector((state) => state.schedule);

    useEffect(() => {
        if (candidateId) {
            const fetchCandidate = async () => {
                try {
                    const data = await getSingleCandidate(candidateId);
                    dispatch(setCandidate(data));
                } catch (error) {
                    console.error("Failed to fetch candidate:", error);
                }
            };
            fetchCandidate();
        }
    }, [candidateId, dispatch]);

    const handleConfirmSchedule = async () => {
        if (!candidateId || !requisitionId || !candidate?.candidate_name) {
            enqueueSnackbar("Missing candidate or requisition ID", { variant: "error" });
            return;
        }

        if (!candidate?.share_token) {
            enqueueSnackbar("Candidate CV share link not available. Please ensure the candidate has a share token.", { variant: "warning" });
            // continue anyway or block? User said they want to work on share_token
        }

        // Combine date and startTime for the backend (ISO 8601)
        const combinedDateTime = dayjs(`${date} ${startTime}`, 'YYYY-MM-DD hh:mm A').toISOString();

        try {

            console.log(`the argument we want to pass are => ${candidate?.candidate_name}, ${interviewTitle}, ${combinedDateTime}, ${duration}, ${locationType}, ${locationDetails}, ${internalInterviewers.map(i => i.email!).filter(Boolean)}, ${candidateEmailBody}, ${candidate?.email}, ${interviewTitle}`)
            await callScheduleInterview({
                candidate_id: candidateId,
                candidate_name: candidate?.candidate_name, 
                requisition_id: requisitionId,
                interview_phase: interviewTitle,
                interview_date: combinedDateTime,
                duration_minutes: duration,
                location_type: locationType,
                location_details: locationType === 'online' ? 'Microsoft Teams' : locationDetails,
                interview_panel: internalInterviewers.map(i => i.email!).filter(Boolean),
                old_status: candidate?.current_status || 'shortlisted',
                publicCvLink: `https://bajaj-hiring.azurewebsites.net/api/share/${candidate?.share_token}`,
                body: candidateEmailBody,
                candidateEmail: candidate?.email || '',
                subject: interviewTitle
            });
            // enqueueSnackbar will be called inside callScheduleInterview
            router.push(`/candidates/view?id=${candidateId}`);
        } catch (error) {
            // Error handling is also partially inside the slice
        }
    };

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
            {step === 1 ? (
                <>
                    <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                        <ScheduleSidebar />

                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <CalendarHeader />
                            <CalendarGrid />
                        </Box>
                    </Box>

                    {/* Page Footer */}
                    <Box sx={{ p: 2, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={3} alignItems="center">
                            {/* <FormControlLabel
                                control={<Switch defaultChecked color="primary" />}
                                label={<Typography variant="body2" fontWeight={600}>Notify Candidate via SMS</Typography>}
                            /> */}
                            {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f0fdf4', px: 1.5, py: 0.5, borderRadius: 2 }}>
                                <CheckCircle sx={{ color: '#22c55e', fontSize: 16 }} />
                                <Typography variant="caption" sx={{ color: '#166534', fontWeight: 600 }}>All Calendars Synced</Typography>
                            </Box> */}
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Button variant="outlined" startIcon={<WhatsApp />} sx={{ textTransform: 'none', borderRadius: 2 }}>Copy WhatsApp Invitation</Button>
                            <Button
                                variant="contained"
                                onClick={() => dispatch(setStep(2))}
                                disabled={!startTime}
                                endIcon={<ArrowForwardIos sx={{ fontSize: 12 }} />}
                                sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#3b82f6' }}
                            >
                                Send Invites
                            </Button>
                        </Stack>
                    </Box>
                </>
            ) : (
                <ReviewAndConfirm onConfirm={handleConfirmSchedule} />
            )}
        </Box>
    );
}
