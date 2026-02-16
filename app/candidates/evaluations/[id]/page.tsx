"use client";

import React, { useEffect, useMemo } from 'react';
import { 
    Box, Container, Typography, Button, Paper, Avatar, 
    LinearProgress, Chip, Stack, Divider, IconButton, Rating 
} from '@mui/material';

import { useParams, useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NoteIcon from '@mui/icons-material/Note';
import { RootState, useSelector } from '@/redux/store';
import { fetchSingleCandidate, callGetCandidateEvaluationDetails } from '@/redux/slices/candidates';
import { getFirstAndLastInitials } from '@/utils/transform';
import { CandidateEvaluationSession, CandidateProfile } from '@/interface/candidate';
import dayjs from 'dayjs';
import { RecommendationBadge } from '@/components/candidates/interview rating/badge';
import { AppRole } from '@/utils/constants';


const CandidateEvaluationsPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const [activeSessionIndex, setActiveSessionIndex] = React.useState(0);

    const { selectedCandidate, candidateEvaluationDetails, loading } = useSelector((state: RootState) => state.candidates);
    const {user} = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        if (id) {
            if (!selectedCandidate || selectedCandidate.candidate_id !== id) {
                 fetchSingleCandidate(id);
            }
            callGetCandidateEvaluationDetails(id);
        }
    }, [id]);

    const candidate = selectedCandidate as CandidateProfile;

    // Use raw details as sessions since API now groups them
    const sessions = useMemo(() => {
        return candidateEvaluationDetails || [];
    }, [candidateEvaluationDetails]);

    // Ensure active index is valid
    useEffect(() => {
        if (activeSessionIndex >= sessions.length && sessions.length > 0) {
            setActiveSessionIndex(0);
        }
    }, [sessions, activeSessionIndex]);

    // Calculate overall average rating from all sessions
    const overallAverageScore = useMemo(() => {
        if (!sessions || sessions.length === 0) return 0;
        
        const totalScore = sessions.reduce((acc, session) => {
            const dayAvgStr = session.day_average?.split('/')[0] || "0";
            return acc + parseFloat(dayAvgStr);
        }, 0);
        
        return totalScore / sessions.length;
    }, [sessions]);

    const activeSession = sessions[activeSessionIndex];

    // Summary Stats Logic
    const stats = useMemo(() => {
        const counts = { StrongHire: 0, Hire: 0, NoHire: 0, Total: 0 };
        sessions.forEach(s => {
             const rec = s.recommendation;
             if (rec === 'strong_hire') counts.StrongHire++;
             else if (rec === 'hire') counts.Hire++;
             else if (rec === 'no_hire' || rec === 'rejected') counts.NoHire++;
             
             counts.Total++;
        });
        
        const hireRate = counts.Total > 0 ? Math.round(((counts.StrongHire + counts.Hire) / counts.Total) * 100) : 0;
        return { ...counts, hireRate };
    }, [sessions]);


    if (!candidate && loading) return <Box sx={{ p: 5, textAlign: 'center' }}><Typography>Loading...</Typography></Box>;
    if (!candidate) return <Box sx={{ p: 5 }}><Typography>Candidate not found</Typography></Box>;

    return (
        <Box sx={{ bgcolor: '#F5F6F8', minHeight: '100vh', display: 'flex', flexDirection: { xs: 'column', lg: 'row' } }}>
            {/* Left Content Area */}
            <Box sx={{ flex: 1, p: { xs: 2, md: 4, lg: 5 }, overflowY: 'auto' }}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => router.back()}
                    sx={{ textTransform: 'none', color: 'text.secondary', mb: 3, fontWeight: 600, fontSize: '0.875rem' }}
                >
                    Back to Candidate List
                </Button>

                {/* Candidate Info Header */}
                <Paper elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', mb: 5, gap: 3 }}>
                     <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        <Avatar 
                            sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 600 }}
                        >
                            {getFirstAndLastInitials(candidate.candidate_name)}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.2 }}>{candidate.candidate_name}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                {candidate.role_applied_for}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Rating readOnly value={overallAverageScore} precision={0.1} size="small" />
                                <Typography variant="body2" fontWeight={700}>{overallAverageScore.toFixed(1)}/5.0</Typography>
                                <Chip 
                                    label={overallAverageScore >= 4.5 ? "High Fit" : overallAverageScore >= 3.5 ? "Good Fit" : overallAverageScore >= 2.5 ? "Moderate Fit" : "Low Fit"} 
                                    size="small" 
                                    color={overallAverageScore >= 3.5 ? "success" : overallAverageScore >= 2.5 ? "warning" : "error"} 
                                    sx={{ fontWeight: 700, borderRadius: 1, height: 20, fontSize: '0.65rem' }} 
                                />
                            </Box>
                        </Box>
                     </Box>

                     {/* Recommendation Percentage Card */}
                     <Box sx={{ 
                         bgcolor: '#ffffff', 
                         p: 2, 
                         borderRadius: 2, 
                         border: '1px solid', 
                         borderColor: 'divider',
                         boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
                         minWidth: 140,
                         textAlign: 'center'
                     }}>
                         <Typography variant="caption" fontWeight={700} color="primary.main" sx={{ display: 'block', mb: 0.5, letterSpacing: 0.5 }}>
                             RECOMMENDATION
                         </Typography>
                         <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ lineHeight: 1 }}>
                             {stats.hireRate}%
                         </Typography>
                         <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            Hire Rate
                         </Typography>
                     </Box>
                </Box>
                </Paper>

                {/* Detailed Feedback Slider Area */}
                <Box>
                     <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                         <NoteIcon fontSize="small" color="primary" /> Detailed Interviewer Feedback
                    </Typography>

                    {sessions.length > 0 ? (
                        <Stack spacing={4}>
                            {sessions.map((session, index) => (
                                <Paper key={index} elevation={0} sx={{ p: 4, border: '1px solid', borderColor: 'divider' }}>
                                    {/* Session Header */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'secondary.main', width: 48, height: 48, fontSize: '1rem' }}>
                                                {getFirstAndLastInitials(session.interviewer_name)}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={700}>{session.interviewer_name}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    Interviewed {dayjs(session.evaluation_date).format('MMM D, YYYY')}
                                                </Typography>
                                                <Typography variant="caption" fontWeight={600} color="primary.main">
                                                    Avg Score: {session.day_average}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <RecommendationBadge type={
                                            session.recommendation === 'strong_hire' ? 'Strong Hire' :
                                            session.recommendation === 'hire' ? 'Hire' :
                                            (session.recommendation === 'no_hire' || session.recommendation === 'rejected') ? 'No Hire' :
                                            (parseFloat(session.day_average?.split('/')[0] || "0") >= 4.5 ? 'Strong Hire' : 
                                             parseFloat(session.day_average?.split('/')[0] || "0") >= 3.5 ? 'Hire' : 'No Hire')
                                        } />
                                    </Box>

                                    <Divider sx={{ mb: 4 }} />

                                    {/* Criteria Grid */}
                                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
                                        {session.evaluation_details?.map((detail, i) => (
                                            <Box key={i} sx={{ 
                                                p: 2, 
                                                border: '1px solid', 
                                                borderColor: 'divider', 
                                                borderRadius: 2,
                                                bgcolor: '#fff',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 2
                                            }}>
                                                {/* Header: Criteria & Score */}
                                                <Box>
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                                                            {detail.criteria.toUpperCase()}
                                                        </Typography>
                                                        <Typography variant="caption" fontWeight={800} color="text.primary">
                                                            {detail.score}/5
                                                        </Typography>
                                                    </Box>
                                                    <LinearProgress 
                                                        variant="determinate" 
                                                        value={(detail.score / 5) * 100} 
                                                        sx={{ 
                                                            height: 6, borderRadius: 3, 
                                                            bgcolor: '#F0F2F5',
                                                            '& .MuiLinearProgress-bar': {
                                                                bgcolor: detail.score >= 4 ? 'success.main' : detail.score >= 3 ? 'warning.main' : 'error.main',
                                                                borderRadius: 3
                                                            }
                                                        }} 
                                                    />
                                                </Box>

                                                {/* Comment */}
                                                <Box sx={{ bgcolor: '#F8F9FA', p: 1.5, borderRadius: 1.5, flex: 1 }}>
                                                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.65rem' }}>
                                                        NOTES
                                                    </Typography>
                                                    <Typography variant="body2" color="text.primary" sx={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
                                                        {detail.comments || "No comments provided."}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </Paper>
                            ))}
                        </Stack>
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No evaluation feedback available.</Typography>
                        </Paper>
                    )}
                </Box>
            </Box>

            {/* Right Sidebar - Full Height */}
            <Box sx={{ 
                width: { lg: 380, xl: 420 }, 
                minWidth: { lg: 380 },
                bgcolor: 'white', 
                borderLeft: '1px solid', 
                borderColor: 'divider',
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                gap: 4
            }}>
                {/* Rating Summary */}
                <Box>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>Rating Summary</Typography>
                    <Divider sx={{ mb: 3 }} />
                    
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={700} color="success.main">STRONG HIRE</Typography>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">{stats.StrongHire} INTERVIEWERS</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={stats.Total > 0 ? (stats.StrongHire/stats.Total)*100 : 0} color="success" sx={{ height: 6, borderRadius: 3, bgcolor: '#E6F4EA' }} />
                    </Box>

                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={700} color="primary.main">HIRE</Typography>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">{stats.Hire} INTERVIEWERS</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={stats.Total > 0 ? (stats.Hire/stats.Total)*100 : 0} color="primary" sx={{ height: 6, borderRadius: 3, bgcolor: '#E3F2FD' }} />
                    </Box>

                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="caption" fontWeight={700} color="error.main">NO HIRE</Typography>
                            <Typography variant="caption" fontWeight={700} color="text.secondary">{stats.NoHire} INTERVIEWERS</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={stats.Total > 0 ? (stats.NoHire/stats.Total)*100 : 0} color="error" sx={{ height: 6, borderRadius: 3, bgcolor: '#FFEBEE' }} />
                    </Box>
                </Box>

                {(user?.role_name == AppRole.HeadOfHr || user?.role_name == AppRole.HrManager) && (
                <Box sx={{ mt: 'auto' }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        onClick={() => router.push(`/candidates/pre-offer/${id}`)}
                        sx={{ mb: 2, py: 1.5, fontWeight: 700, borderRadius: 2, textTransform: 'none', fontSize: '0.9rem' }}
                    >
                        Begin Pre Offer Process
                    </Button>
                    <Button variant="outlined" color="error" fullWidth sx={{ py: 1.5, fontWeight: 700, borderRadius: 2, textTransform: 'none', fontSize: '0.9rem' }}>
                        Reject Candidate
                    </Button>
                </Box>
                )}
            </Box>
        </Box>
    );
};

export default CandidateEvaluationsPage;
