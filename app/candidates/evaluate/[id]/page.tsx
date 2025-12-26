"use client";

import React, { useEffect, useState, useMemo } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Rating,
  TextField,
  Button,
  Container,
  Paper,
  Divider,
  Chip,
  Alert,
  Avatar,
  Stack,
  useTheme,
  IconButton,
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  LocationOn,
  AttachMoney,
  Close as CloseIcon
} from '@mui/icons-material';
import { RootState, useSelector } from '@/redux/store';
import { fetchEvaluationForm } from '@/redux/slices/interview';
import { fetchSingleCandidate } from '@/redux/slices/candidates';
import { useParams, useRouter } from 'next/navigation';
import { AppRole } from '@/utils/constants';

const EvaluationPage = () => {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  
  const candidateId = params.id as string;

  const { evaluationForm, loading: interviewLoading, error: interviewError } = useSelector((state: RootState) => state.interviews);
  const { selectedCandidate, loading: candidateLoading, error: candidateError } = useSelector((state: RootState) => state.candidates);
  const { user } = useSelector((state: RootState) => state.auth);

  const [ratings, setRatings] = useState<Record<string, { rating: number | null, comment: string }>>({});
  const [submitted, setSubmitted] = useState(false);

  // Derivations
  const isRecruiter = user?.role_name === AppRole.Recruiter;
  
  // NOTE: REPLACE THIS HARDCODED 'Digital' WITH ACTUAL LOGIC WHEN READY
  // const candidateDepartment = selectedCandidate?.department;
  const candidateDepartment = 'Digital'; 

  // Initial Fetch
  useEffect(() => {
    if (candidateId) {
        fetchSingleCandidate(candidateId);
    }
  }, [candidateId]);

  // Form Fetch
  useEffect(() => {
    if (candidateDepartment) {
      fetchEvaluationForm(candidateDepartment);
      setRatings({});
    }
  }, [candidateDepartment]);

  const handleRatingChange = (parameter: string, newValue: number | null) => {
    setRatings(prev => ({ 
        ...prev, 
        [parameter]: { ...prev[parameter], rating: newValue } 
    }));
  };

  const handleCommentChange = (parameter: string, comment: string) => {
    setRatings(prev => ({ 
        ...prev, 
        [parameter]: { ...prev[parameter], comment: comment } 
    }));
  };

  const handleSubmit = () => {
    console.log({
      candidateId: selectedCandidate?.candidate_id,
      evaluatorId: user?.user_id,
      evaluation: ratings,
    });
    setSubmitted(true);
    setTimeout(() => {
        router.push('/candidates');
    }, 2000);
  };

  const loading = interviewLoading || candidateLoading;
  const error = interviewError || candidateError;

  // Use the API pattern provided by the user for CV retrieval
  const cvUrl = useMemo(() => {
      if(!selectedCandidate?.candidate_id) return null;
      // Using process.env.NEXT_PUBLIC_API_URL if available, otherwise fallback (though normally it should be set)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      return `${baseUrl}/candidate/resume?candidateId=${selectedCandidate.candidate_id}`;
  }, [selectedCandidate?.candidate_id]);

  if (loading && !selectedCandidate) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
              <CircularProgress size={60} thickness={4} />
          </Box>
      );
  }

  if (error) {
    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
                Something went wrong. Please try again later.
            </Alert>
            <Button variant="outlined" onClick={() => router.back()}>Go Back</Button>
        </Container>
    );
  }

  if (submitted) {
      return (
          <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
              <Paper sx={{ p: 6, borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                  <Typography variant="h4" gutterBottom>Evaluation Submitted</Typography>
                  <Typography color="text.secondary">Redirecting to candidates list...</Typography>
              </Paper>
          </Container>
      )
  }

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', bgcolor: 'grey.50' }}>
        {/* TOP BAR */}
        <Paper elevation={0} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>
                    {selectedCandidate?.candidate_name?.charAt(0) || 'C'}
                </Avatar>
                <Box>
                    <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                        {selectedCandidate?.candidate_name}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" color="text.secondary">
                            {selectedCandidate?.role_applied_for}
                        </Typography>
                        <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto' }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                            <LocationOn sx={{ fontSize: 14 }} />
                            <Typography variant="caption">{selectedCandidate?.location || 'Location N/A'}</Typography>
                        </Box>
                        {selectedCandidate?.current_gross_salary && (
                            <>
                             <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto' }} />
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                 <AttachMoney sx={{ fontSize: 14 }} />
                                 <Typography variant="caption">{selectedCandidate?.current_gross_salary}</Typography>
                             </Box>
                            </>
                        )}
                         <Chip 
                            label={selectedCandidate?.current_status || 'Active'} 
                            size="small"
                            color="primary" 
                            variant="outlined" 
                            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                        />
                    </Stack>
                </Box>
            </Box>

            <Box>
                <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit} 
                    color="primary"
                    disabled={evaluationForm.length === 0}
                    sx={{ borderRadius: 2 }}
                >
                    Save & Submit
                </Button>
                <IconButton onClick={() => router.back()} sx={{ ml: 1 }}>
                    <CloseIcon />
                </IconButton>
            </Box>
        </Paper>

        {/* MAIN SPLIT CONTENT - Flexbox Layout with Gap */}
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden', gap: 2, p: 2 }}>
            
            {/* LEFT PANEL: CV VIEWER (60%) */}
            <Box sx={{ flex: '0 0 60%', height: '100%', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[1] }}>
                {cvUrl ? (
                    <iframe 
                        src={cvUrl} 
                        width="100%" 
                        height="100%" 
                        style={{ border: 'none' }}
                        title="Candidate CV"
                    />
                ) : (
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column',  justifyContent: 'center', alignItems: 'center', p: 4, color: 'text.secondary' }}>
                        <AssignmentIcon sx={{ fontSize: 64, mb: 2, opacity: 0.2 }} />
                        <Typography variant="h6">No CV Available</Typography>
                        <Typography variant="body2">Unable to load CV for this candidate.</Typography>
                    </Box>
                )}
            </Box>

            {/* RIGHT PANEL: EVALUATION FORM (Remaining space ~40%) */}
            <Box sx={{ flex: 1, height: '100%', overflowY: 'auto', bgcolor: 'background.paper', borderRadius: 2, boxShadow: theme.shadows[1] }}>
                <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                        Performance Evaluation
                    </Typography>
                    
                    {evaluationForm.length === 0 ? (
                        <Alert severity="info" variant="outlined">No evaluation form available for this department.</Alert>
                    ) : (
                        <Stack spacing={2}>
                            {evaluationForm.map((item, index) => (
                                <Paper 
                                    key={index}
                                    variant="outlined"
                                    sx={{ 
                                        p: 2, 
                                        borderRadius: 2,
                                        borderColor: 'divider',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            borderColor: 'primary.light',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {item.parameter_name}
                                        </Typography>
                                        <Rating
                                            name={`rating-${item.parameter_name}`}
                                            value={ratings[item.parameter_name]?.rating || 0}
                                            onChange={(event, newValue) => {
                                                handleRatingChange(item.parameter_name, newValue);
                                            }}
                                            size="small"
                                        />
                                    </Box>

                                    {/* Collapsible/Small guidance text */}
                                    {item.guidance_points?.length > 0 && (
                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5, fontStyle: 'italic', lineHeight: 1.3 }}>
                                            Guidance: {item.guidance_points.join(', ')}
                                        </Typography>
                                    )}

                                    <TextField
                                        placeholder={`Observations...`}
                                        multiline
                                        minRows={2}
                                        maxRows={4}
                                        value={ratings[item.parameter_name]?.comment || ''}
                                        onChange={(e) => handleCommentChange(item.parameter_name, e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        InputProps={{ sx: { fontSize: '0.875rem', bgcolor: 'grey.50' } }}
                                    />
                                </Paper>
                            ))}
                        </Stack>
                    )}
                    
                    <Box sx={{ height: 60 }} /> 
                </Box>
            </Box>
        </Box>
    </Box>
  );
};

export default EvaluationPage;
