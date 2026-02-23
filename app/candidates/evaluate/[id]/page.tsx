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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { 
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Save as SaveIcon,
  LocationOn,
  AttachMoney,
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { RootState, useSelector } from '@/redux/store';
import { callInsertCandidateEvaluation, fetchEvaluationForm } from '@/redux/slices/interview';
import { fetchSingleCandidate } from '@/redux/slices/candidates';
import { useParams, useRouter } from 'next/navigation';
import { AppRole } from '@/utils/constants';
import { getStatusChipProps } from '@/utils/statusColorMapping';

const EvaluationPage = () => {
  const params = useParams();
  const router = useRouter();
  const theme = useTheme();
  
  const candidateId = params.id as string;
 

  const { evaluationForm, loading: interviewLoading, error: interviewError } = useSelector((state: RootState) => state.interviews);
  const { selectedCandidate, loading: candidateLoading, error: candidateError } = useSelector((state: RootState) => state.candidates);
  const { user } = useSelector((state: RootState) => state.auth);

  console.log(`the form is ${JSON.stringify(evaluationForm)}`)
  const [ratings, setRatings] = useState<Record<string, { rating: number | null, comment: string }>>({});
  const [recommendation, setRecommendation] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
    const statusProps = getStatusChipProps(selectedCandidate?.current_status);
  
  let resumeUrl

  // Derivations
  const isRecruiter = user?.role_name === AppRole.Recruiter;
  
  const candidateDepartment = selectedCandidate?.department;

  // Initial Fetch Candidate
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

  const handleRatingChange = (criteriaId: string | number, newValue: number | null) => {
    setRatings(prev => ({ 
        ...prev, 
        [criteriaId]: { ...prev[criteriaId], rating: newValue } 
    }));
  };

  const handleCommentChange = (criteriaId: string | number, comment: string) => {
    setRatings(prev => ({ 
        ...prev, 
        [criteriaId]: { ...prev[criteriaId], comment: comment } 
    }));
  };

  const isFormValid = useMemo(() => {
      if (!evaluationForm || evaluationForm.length === 0) return false;
      const allCriteriaRated = evaluationForm.every(item => {
          const r = ratings[item.evaluation_criteria_id];
          return r && typeof r.rating === 'number' && r.rating > 0 && r.comment && r.comment.trim().length > 0;
      });
      return allCriteriaRated && recommendation !== '';
  }, [evaluationForm, ratings, recommendation]);

  const handleSubmit = async() => {
    if (!selectedCandidate?.candidate_id || !user?.user_id || !selectedCandidate.requisition_id) {
        console.error('Missing candidate ID or User ID');
        return;
    }

    if (!isFormValid) {
        console.error('Form is invalid');
        return;
    }
    const finalEvaluation = ratings as Record<string, { rating: number, comment: string }>;

    console.log({
      candidateId: selectedCandidate.candidate_id,
      evaluatorId: user.user_id,
      evaluation: finalEvaluation,
      recommendation,
    });
    
    await callInsertCandidateEvaluation({
      candidateId: selectedCandidate.candidate_id,
      evaluatorId: user.user_id,
      evaluation: finalEvaluation,
      recommendation,
      requisitionId: selectedCandidate.requisition_id
    });
    setSubmitted(true);
    setTimeout(() => {
        router.push('/candidates/pending_feedback');
    }, 2000);
  };

  const loading = interviewLoading || candidateLoading;
  const error = interviewError || candidateError;

  // Direct URL for the "Open in New Tab" button (Standard link)
  const directCvUrl = selectedCandidate?.cv_path

  if (loading && !selectedCandidate) {
      return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
              <CircularProgress size={60} thickness={4} />
          </Box>
      );
  }

//   if (error) {
//     return (
//         <Container maxWidth="md" sx={{ mt: 8 }}>
//             <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
//                 Something went wrong. Please try again later.
//             </Alert>
//             <Button variant="outlined" onClick={() => router.back()}>Go Back</Button>
//         </Container>
//     );
//   }


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
                        
                        {selectedCandidate?.current_gross_salary && (
                            <>
                             <Divider orientation="vertical" flexItem sx={{ height: 16, my: 'auto' }} />
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                 <AttachMoney sx={{ fontSize: 14 }} />
                                 <Typography variant="caption">{selectedCandidate?.current_gross_salary}</Typography>
                             </Box>
                            </>
                        )}
                        {selectedCandidate?.current_status && (
                         <Chip 
                            {...statusProps} 
                            size="small" 
                            sx={{ ...statusProps.sx, fontWeight: 700, textTransform: 'uppercase', height: 24 }} 
                        />
                        )}
                    </Stack>
                </Box>
            </Box>

            <Box>
                <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    onClick={handleSubmit} 
                    color="primary"
                    disabled={!isFormValid}
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
            <Box sx={{ flex: '0 0 60%', height: '100%', bgcolor: 'background.paper', borderRadius: 2, overflow: 'hidden', boxShadow: theme.shadows[1], display: 'flex', flexDirection: 'column' }}>
                {/* CV Handler Header */}
                <Box sx={{ p: 1, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'grey.50' }}>
                    <Typography variant="subtitle2" sx={{ ml: 1, color: 'text.secondary', fontWeight: 'bold' }}>
                        Candidate Document
                    </Typography>
                    {directCvUrl && (
                        <Button 
                            size="small" 
                            endIcon={<OpenInNewIcon fontSize="small" />} 
                            component="a" 
                            href={directCvUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            sx={{ textTransform: 'none' }}
                        >
                            Open in New Tab
                        </Button>
                    )}
                </Box>
                
                {/* CV Content */}
                <Box sx={{ flexGrow: 1, position: 'relative', bgcolor: 'grey.100' }}>
                    <iframe 
                            src={selectedCandidate?.cv_path} 
                            width="100%" 
                            height="100%" 
                            style={{ border: 'none', display: 'block' }}
                            title="Candidate CV"
                        />
                </Box>
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
                                            name={`rating-${item.evaluation_criteria_id}`}
                                            value={ratings[item.evaluation_criteria_id]?.rating || 0}
                                            onChange={(event, newValue) => {
                                                handleRatingChange(item.evaluation_criteria_id, newValue);
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
                                        value={ratings[item.evaluation_criteria_id]?.comment || ''}
                                        onChange={(e) => handleCommentChange(item.evaluation_criteria_id, e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                        size="small"
                                        InputProps={{ sx: { fontSize: '0.875rem', bgcolor: 'grey.50' } }}
                                    />
                                </Paper>
                            ))}
                            
                            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2, mt: 2, borderColor: 'primary.main', bgcolor: 'primary.50' }}>
                                <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary.main">
                                    Final Recommendation
                                </Typography>
                                <FormControl fullWidth size="small" sx={{ mt: 1, bgcolor: 'background.paper' }}>
                                    <InputLabel id="recommendation-select-label">Recommendation</InputLabel>
                                    <Select
                                        labelId="recommendation-select-label"
                                        id="recommendation-select"
                                        value={recommendation}
                                        label="Recommendation"
                                        onChange={(e: SelectChangeEvent) => setRecommendation(e.target.value)}
                                    >
                                        <MenuItem value="strong_hire">Strong Hire</MenuItem>
                                        <MenuItem value="hire">Hire</MenuItem>
                                        <MenuItem value="no_hire">No Hire</MenuItem>
                                        <MenuItem value="rejected">Reject</MenuItem>
                                    </Select>
                                </FormControl>
                            </Paper>
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
