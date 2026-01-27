"use client";

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import { getSingleCandidate } from '@/api/candidate';
import { CandidateProfile } from '@/interface/candidate';
import CandidateProfileHeader from '@/components/candidates/view/CandidateProfileHeader';
import CandidateMainContent from '@/components/candidates/view/CandidateMainContent';
import CandidateRightSidebar from '@/components/candidates/view/CandidateRightSidebar';


const CandidateViewPage = () => {
    const params = useParams();
    const id = params?.id as string;
    
    const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCandidate = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await getSingleCandidate(id);
                // The API might return it wrapped or directly. Based on api/candidate.ts it returns response.data.data
                setCandidate(data); 
            } catch (error) {
                console.error("Failed to load candidate", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCandidate();
    }, [id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!candidate) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography variant="h6">Candidate not found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: '#F5F6F8', minHeight: '100vh', pb: 4 }}>
             {/* Header */}
             <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', px: 4, py: 2, mb: 3 }}>
                <CandidateProfileHeader candidate={candidate} />
             </Box>

             <Container maxWidth="xl">
                <Box sx={{ display: 'flex', gap: 3, alignItems: 'start' }}>
                    {/* Left Sidebar */}
                    {/* <Box sx={{ width: 280, flexShrink: 0 }}>
                        <CandidateSidebar candidate={candidate} />
                    </Box> */}

                    {/* Main Content (Tabs) */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <CandidateMainContent candidate={candidate} />
                    </Box>

                    {/* Right Sidebar */}
                    <Box sx={{ width: 320, flexShrink: 0 }}>
                         <CandidateRightSidebar candidate={candidate} />
                    </Box>
                </Box>
             </Container>
        </Box>
    );
};

export default CandidateViewPage;
