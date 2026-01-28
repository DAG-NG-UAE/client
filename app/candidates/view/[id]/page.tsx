"use client";

import React, { useEffect } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { callGetCandidateTotalEvaluation, fetchSingleCandidate } from '@/redux/slices/candidates';
import { CandidateProfile } from '@/interface/candidate';
import CandidateProfileHeader from '@/components/candidates/view/CandidateProfileHeader';
import CandidateMainContent from '@/components/candidates/view/CandidateMainContent';
import CandidateRightSidebar from '@/components/candidates/view/CandidateRightSidebar';
import { RootState, useSelector } from '@/redux/store';


const CandidateViewPage = () => {
    const params = useParams();
    const id = params?.id as string;
    
    const { selectedCandidate, loading, candidateTotalEvaluation } = useSelector((state: RootState) => state.candidates);
    const hasCandidate = selectedCandidate && selectedCandidate.candidate_id === id;

    useEffect(() => {
        if (id) {
            fetchSingleCandidate(id);
            callGetCandidateTotalEvaluation(id);
        }
    }, [id]);

    if (loading && !hasCandidate) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!hasCandidate && !loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6">Candidate not found</Typography>
            </Box>
        );
    }
    
    // We cast to CandidateProfile because we expect the data to be sufficient or eventual consistent
    // This resolves the "Partial<CandidateProfile>" mismatch error
    const candidate = selectedCandidate as CandidateProfile;

    return (
        <Box sx={{ bgcolor: '#F5F6F8', minHeight: '100vh', pb: 4 }}>
             {/* Header */}
             <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', px: 4, py: 2, mb: 3 }}>
                {candidate && <CandidateProfileHeader candidate={candidate} />}
             </Box>

             <Container maxWidth="xl">
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'start' }}>
                    {/* Left Sidebar */}
                    {/* <Box sx={{ width: 280, flexShrink: 0 }}>
                        <CandidateSidebar candidate={candidate} />
                    </Box> */}

                    {/* Main Content (Tabs) */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        {candidate && <CandidateMainContent candidate={candidate} />}
                    </Box>

                    {/* Right Sidebar */}
                    <Box sx={{ width: 320, flexShrink: 0 }}>
                         {candidate && <CandidateRightSidebar candidate={candidate} evaluations={candidateTotalEvaluation || []}/>}
                    </Box>
                </Box>
             </Container>
        </Box>
    );
};

export default CandidateViewPage;
