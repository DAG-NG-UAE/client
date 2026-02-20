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
import { setStep } from '@/redux/slices/schedule';
import dayjs from 'dayjs';

interface ReviewAndConfirmProps {
    onConfirm: () => void;
}

export const ReviewAndConfirm = ({ onConfirm }: ReviewAndConfirmProps) => {
    const dispatch = useDispatch();
    const { candidate, date, interviewTitle, internalInterviewers } = useSelector((state) => state.schedule);
    const formattedDate = dayjs(date).format('dddd, MMM D, YYYY');

    return (
        <Box sx={{ p: 4, height: '100%', overflowY: 'auto', bgcolor: '#f8fafc' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Breadcrumbs aria-label="breadcrumb">
                    <MuiLink underline="hover" color="inherit" href="#" onClick={(e) => { e.preventDefault(); dispatch(setStep(1)); }}>Schedule</MuiLink>
                    <Typography color="text.primary" sx={{ fontWeight: 600 }}>Preview Invitations</Typography>
                    <Typography color="text.disabled">Sent</Typography>
                </Breadcrumbs>
                <Button startIcon={<Edit />} sx={{ color: 'text.secondary', textTransform: 'none' }}>Edit Templates</Button>
            </Stack>

            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>Review & Confirm</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Final verification of the notifications that will be sent to <b>{candidate?.candidate_name}</b> and the <b>Engineering Team</b>.
            </Typography>

            <Grid container spacing={3}>
                {/* Candidate Email Preview */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 0, border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Email sx={{ color: '#1e40af' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1e40af' }}>Candidate Email</Typography>
                            </Stack>
                            <Chip label="Draft Preview" size="small" sx={{ bgcolor: '#dcfce7', color: '#166534', fontWeight: 600 }} />
                        </Box>
                        <Box sx={{ p: 3, bgcolor: 'white' }}>
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <Typography variant="caption" color="text.secondary">From: <span style={{ color: '#1e293b' }}>TechCorp Careers &lt;hiring@techcorp.com&gt;</span></Typography>
                                <Typography variant="caption" color="text.secondary">To: <span style={{ color: '#1e293b' }}>{candidate?.candidate_name} &lt;{candidate?.email}&gt;</span></Typography>
                                <Typography variant="caption" color="text.secondary">Subject: <span style={{ color: '#1e293b' }}>Interview: {interviewTitle} at TechCorp</span></Typography>
                            </Stack>
                            <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                <Typography variant="body2" sx={{ mb: 2 }}>Hi {candidate?.candidate_name?.split(' ')[0]},</Typography>
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    We're excited to move forward with your application for the <b>{interviewTitle.split('-')[0].trim()}</b> position. We've scheduled your final round interview with our engineering and design leads.
                                </Typography>
                                <Box sx={{ p: 2, bgcolor: '#eff6ff', borderLeft: '3px solid #3b82f6', borderRadius: 1, mb: 2 }}>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1.5}>
                                            <CalendarMonth sx={{ color: '#3b82f6', fontSize: 20 }} />
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{formattedDate}</Typography>
                                        </Stack>
                                        <Typography variant="caption" sx={{ ml: 4, display: 'block', mt: -0.5 }}>2:00 PM - 3:30 PM (PDT)</Typography>
                                        <Stack direction="row" spacing={1.5} sx={{ mt: 1 }}>
                                            <Box component="span" sx={{ color: '#3b82f6' }}>🎥</Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Video Meeting Link</Typography>
                                        </Stack>
                                        <MuiLink href="#" sx={{ ml: 4, fontSize: '0.75rem' }}>meet.google.com/abc-defg-hij</MuiLink>
                                    </Stack>
                                </Box>
                                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>You will be meeting with:</Typography>
                                <Stack direction="row" spacing={2}>
                                    {internalInterviewers.slice(0, 2).map((int, idx) => (
                                        <Paper key={idx} sx={{ p: 1, flex: 1, display: 'flex', gap: 1, alignItems: 'center', border: '1px solid #f1f5f9' }}>
                                            <Avatar sx={{ width: 24, height: 24 }}>{int.displayName[0]}</Avatar>
                                            <Box>
                                                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>{int.displayName}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>{int.jobTitle}</Typography>
                                            </Box>
                                        </Paper>
                                    ))}
                                </Stack>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                {/* Interviewer Calendar Invite Preview */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ p: 0, border: '1px solid #e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <Box sx={{ p: 2, bgcolor: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarMonth sx={{ color: 'text.primary' }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Interviewer Calendar Invite</Typography>
                            </Stack>
                            <Chip label="Internal Only" size="small" sx={{ bgcolor: '#f1f5f9', color: 'text.secondary', fontWeight: 600 }} />
                        </Box>
                        <Box sx={{ p: 3, bgcolor: 'white' }}>
                            <Box sx={{ p: 2, border: '1px solid #e2e8f0', borderRadius: 2, borderLeft: '4px solid #3b82f6', display: 'flex', gap: 2, mb: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="overline" sx={{ display: 'block', lineHeight: 1, color: '#3b82f6', fontWeight: 800 }}>{dayjs(date).format('MMM')}</Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, lineHeight: 1 }}>{dayjs(date).format('DD')}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Interview: {candidate?.candidate_name} / {interviewTitle}</Typography>
                                    <Typography variant="caption" color="text.secondary">🕒 2:00 PM - 3:30 PM (90 mins)</Typography>
                                </Box>
                            </Box>

                            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                                <Paper sx={{ flex: 1, p: 2, bgcolor: '#eff6ff', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                                    <Box sx={{ mb: 1 }}>📄</Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: '#1e40af' }}>View Resume</Typography>
                                    <Typography variant="caption" sx={{ fontSize: 8, color: 'text.secondary' }}>RESUME_{candidate?.candidate_name?.replace(' ', '_').toUpperCase()}.PDF</Typography>
                                </Paper>
                                <Paper sx={{ flex: 1, p: 2, bgcolor: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                    <Box sx={{ mb: 1 }}>📋</Box>
                                    <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Open Scorecard</Typography>
                                    <Typography variant="caption" sx={{ fontSize: 8, color: 'text.secondary' }}>INTERVIEWER PACK</Typography>
                                </Paper>
                            </Stack>

                            <Stack spacing={2}>
                                <Typography variant="overline" sx={{ fontWeight: 800, color: 'text.secondary' }}>Meeting Details</Typography>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box>🔗</Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Meeting Link</Typography>
                                        <MuiLink href="#" sx={{ fontSize: 11 }}>meet.google.com/abc-defg-hij</MuiLink>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box>ℹ️</Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Context</Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>Final stage technical and cultural fit interview. Focus on design systems and stakeholder management.</Typography>
                                    </Box>
                                </Box>
                                <Box sx={{ display: 'flex', gap: 2 }}>
                                    <Box>👥</Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>Attendees</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {internalInterviewers.map(i => i.displayName).join(', ')}, {candidate?.candidate_name}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Footer for Step 2 */}
            <Box sx={{ position: 'sticky', bottom: -32, mt: 4, ml: -4, mr: -4, mb: -4, p: 3, borderTop: '1px solid #e2e8f0', bgcolor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <Button onClick={() => dispatch(setStep(1))} startIcon={<ArrowBack />} sx={{ color: 'text.secondary', textTransform: 'none' }}>Cancel & Review</Button>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<ContentCopy />} sx={{ textTransform: 'none', borderRadius: 2 }}>Copy to WhatsApp</Button>
                    <Button variant="contained" onClick={onConfirm} endIcon={<Send />} sx={{ textTransform: 'none', borderRadius: 2, bgcolor: '#1d4ed8', px: 4 }}>Confirm & Send All</Button>
                </Stack>
            </Box>
        </Box>
    );
};
