"use client";

import React from 'react';
import {
    Box, Typography, Button, Stack, Paper, Grid,
    Avatar, Chip, Breadcrumbs, Link as MuiLink
} from '@mui/material';
import {
    Email, CalendarMonth, Edit, ArrowBack,
    ContentCopy, Send
} from '@mui/icons-material';
import { useSelector, useDispatch } from '@/redux/store';
import { setStep, setEmailCustomization, setEditPreview } from '@/redux/slices/schedule';
import dayjs from 'dayjs';
import { TextField } from '@mui/material';

interface ReviewAndConfirmProps {
    onConfirm: () => void;
}

export const ReviewAndConfirm = ({ onConfirm }: ReviewAndConfirmProps) => {
    const dispatch = useDispatch();
    const {
        candidate, date, interviewTitle, duration,
        internalInterviewers, startTime, endTime,
        locationType, locationDetails, candidateEmailBody,
        interviewerContext, isEditingPreview
    } = useSelector((state) => state.schedule);

    const formattedDate = dayjs(date).format('dddd, MMM D, YYYY');

    // Initialize email body if empty
    React.useEffect(() => {
        if (!candidateEmailBody && candidate) {
            const body = `Hi ${candidate.candidate_name?.split(' ')[0]},\n\nWe're excited to move forward with your application for the ${interviewTitle} position. We've scheduled your interview with our search committee.\n\nDate: ${dayjs(date).format('dddd, MMMM D, YYYY')}\nTime: ${startTime} - ${endTime} WAT (West Africa Time, UTC+1)\nDuration: ${duration} minutes\n\nPlease find further details of the call below. We look forward to speaking with you!`;
            dispatch(setEmailCustomization({ emailBody: body }));
        }
    }, [candidate, interviewTitle, dispatch, candidateEmailBody]);

    return (
        <Box sx={{ p: 4, height: '100%', overflowY: 'auto', bgcolor: '#f8fafc' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <MuiLink underline="hover" color="inherit" href="#" onClick={(e) => { e.preventDefault(); dispatch(setStep(1)); }}>Schedule</MuiLink>
                    <Typography color="text.primary" sx={{ fontWeight: 600 }}>Preview Invitations</Typography>
                    <Typography color="text.disabled">Sent</Typography>
                </Breadcrumbs>
                <Button
                    variant={isEditingPreview ? "contained" : "text"}
                    onClick={() => dispatch(setEditPreview(!isEditingPreview))}
                    startIcon={<Edit />}
                    sx={{
                        textTransform: 'none',
                        borderRadius: 2,
                        bgcolor: isEditingPreview ? '#7c3aed' : 'transparent',
                        color: isEditingPreview ? 'white' : 'text.secondary',
                        '&:hover': { bgcolor: isEditingPreview ? '#6d28d9' : '#f1f5f9' }
                    }}
                >
                    {isEditingPreview ? "Save Changes" : "Edit Templates"}
                </Button>
            </Stack>

            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Review & Confirm</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Final verification of the notifications that will be sent to <b>{candidate?.candidate_name}</b> and the <b>Engineering Team</b>.
            </Typography>

            <Grid container spacing={3}>


                {/* Interviewer Calendar Invite Preview */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 0, border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarMonth sx={{ color: 'text.primary' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Interviewer Calendar Invite</Typography>
                            </Stack>
                            <Chip label="Internal Outlook Invite" size="small" sx={{ bgcolor: '#f1f5f9', color: 'text.secondary', fontWeight: 600 }} />
                        </Box>
                        <Box sx={{ p: 3, bgcolor: 'white', flex: 1 }}>
                            <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, borderLeft: '4px solid #3b82f6', display: 'flex', gap: 2, mb: 3, bgcolor: '#f8fafc' }}>
                                <Box sx={{ textAlign: 'center', minWidth: 45 }}>
                                    <Typography variant="overline" sx={{ display: 'block', lineHeight: 1, color: '#3b82f6', fontWeight: 800 }}>{dayjs(date).format('MMM')}</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>{dayjs(date).format('DD')}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{interviewTitle}: {candidate?.candidate_name}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                        🕒 {startTime} - {endTime} ({duration} mins)
                                    </Typography>
                                </Box>
                            </Box>

                            {/* <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                                <Paper elevation={0} sx={{ flex: 1, p: 2, bgcolor: '#eff6ff', border: '1px solid #bfdbfe', textAlign: 'center', borderRadius: 2 }}>
                                    <Box sx={{ mb: 1, fontSize: 20 }}>📄</Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: '#1e40af' }}>View Resume</Typography>
                                    <Typography variant="caption" sx={{ fontSize: 9, color: '#3b82f6', fontWeight: 600 }}>[Link: {candidate?.share_token ? `api/share/${candidate.share_token}` : 'Generate Link'}]</Typography>
                                </Paper>
                                <Paper elevation={0} sx={{ flex: 1, p: 2, bgcolor: '#fdf4ff', border: '1px solid #f5d0fe', textAlign: 'center', borderRadius: 2 }}>
                                    <Box sx={{ mb: 1, fontSize: 20 }}>📋</Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: '#701a75' }}>Open Scorecard</Typography>
                                    <Typography variant="caption" sx={{ fontSize: 9, color: '#a21caf', fontWeight: 600 }}>INTERVIEWER_PACK.PDF</Typography>
                                </Paper>
                            </Stack> */}

                            <Stack spacing={2}>
                                <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary', fontSize: 10, letterSpacing: 1 }}>Meeting Details</Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ width: 20, textAlign: 'center' }}>🔗</Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Meeting Link</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {locationType === 'online' ? (
                                                <span style={{ color: '#64748b', fontStyle: 'italic' }}>Microsoft Teams link will be generated automatically</span>
                                            ) : (
                                                <span style={{ fontWeight: 600, color: '#1e293b' }}>{locationDetails || 'Location details required'}</span>
                                            )}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ width: 20, textAlign: 'center' }}>ℹ️</Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Context</Typography>
                                        {isEditingPreview ? (
                                            <TextField
                                                fullWidth
                                                multiline
                                                rows={2}
                                                size="small"
                                                value={interviewerContext}
                                                onChange={(e) => dispatch(setEmailCustomization({ context: e.target.value }))}
                                                sx={{ '& .MuiOutlinedInput-root': { fontSize: 11, bgcolor: 'white' } }}
                                            />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                                                {interviewerContext}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ width: 20, textAlign: 'center' }}>👥</Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Attendees</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                            {internalInterviewers.map(i => i.displayName).join(', ')}, {candidate?.candidate_name}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>
                </Grid>

                {/* Candidate Email Preview */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 0, border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Email sx={{ color: '#1e40af' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e40af' }}>Candidate Email</Typography>
                            </Stack>
                            <Chip label="Outlook Draft" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 600 }} />
                        </Box>
                        <Box sx={{ p: 3, bgcolor: 'white', flex: 1 }}>
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>From: <span style={{ color: '#1e293b' }}>Hiring Manager &lt;noreply@bajajnigeria.com&gt;</span></Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>To: <span style={{ color: '#1e293b' }}>{candidate?.candidate_name} &lt;{candidate?.email}&gt;</span></Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Subject: <span style={{ color: '#1e293b' }}>Action Needed: Interview for {interviewTitle}</span></Typography>
                            </Stack>

                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                                {isEditingPreview ? (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={8}
                                        value={candidateEmailBody}
                                        onChange={(e) => dispatch(setEmailCustomization({ emailBody: e.target.value }))}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: 12,
                                                lineHeight: 1.5,
                                                bgcolor: 'white',
                                                fontFamily: 'monospace'
                                            }
                                        }}
                                    />
                                ) : (
                                    <Typography variant="body2" sx={{
                                        fontSize: 12,
                                        lineHeight: 1.6,
                                        whiteSpace: 'pre-line',
                                        color: '#334155'
                                    }}>
                                        {candidateEmailBody}
                                    </Typography>
                                )}

                                <Box sx={{ p: 2, bgcolor: 'white', borderLeft: '3px solid #3b82f6', borderRadius: 1, mt: 3, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    <Stack spacing={1.5}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <CalendarMonth sx={{ color: '#3b82f6', fontSize: 18 }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>{formattedDate}</Typography>
                                        </Stack>
                                        <Typography variant="caption" sx={{ ml: 4, display: 'block', mt: -1, fontWeight: 600, color: 'text.secondary' }}>
                                            {startTime} - {endTime} (Local Time)
                                        </Typography>

                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                                            <Box component="span" sx={{ fontSize: 16 }}>{locationType === 'online' ? '🎥' : '📍'}</Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                                                {locationType === 'online' ? 'Microsoft Teams Meeting' : 'In-Person Interview'}
                                            </Typography>
                                        </Stack>
                                        <MuiLink href="#" sx={{ ml: 4, fontSize: 11, fontWeight: 600, color: locationType === 'online' ? '#3b82f6' : 'text.secondary' }}>
                                            {locationType === 'online' ? 'Link will be sent in calendar invite' : locationDetails}
                                        </MuiLink>
                                    </Stack>
                                </Box>

                                <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #f1f5f9' }}>
                                    <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>YOUR INTERVIEWERS:</Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {internalInterviewers.map((int, idx) => (
                                            <Chip
                                                key={idx}
                                                avatar={<Avatar sx={{ width: 20, height: 20, fontSize: 10 }}>{int.displayName[0]}</Avatar>}
                                                label={int.displayName}
                                                size="small"
                                                variant="outlined"
                                                sx={{ height: 24, fontSize: 10, fontWeight: 600 }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Footer for Step 2 */}
            <Box sx={{ position: 'sticky', bottom: -32, mt: 4, ml: -4, mr: -4, mb: -4, p: 3, borderTop: '1px solid #e2e8f0', bgcolor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <Button onClick={() => dispatch(setStep(1))} startIcon={<ArrowBack />} sx={{ color: 'text.secondary', textTransform: 'none' }}>Cancel & Review</Button>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<ContentCopy />} sx={{ textTransform: 'none', borderRadius: 2 }}>Copy to WhatsApp</Button>
                    <Button
                        variant="contained"
                        onClick={onConfirm}
                        disabled={isEditingPreview}
                        endIcon={<Send />}
                        sx={{
                            textTransform: 'none',
                            borderRadius: 2,
                            px: 4,
                            '&.Mui-disabled': { bgcolor: '#94a3b8', color: 'white' }
                        }}
                    >
                        Confirm & Send All
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
};
