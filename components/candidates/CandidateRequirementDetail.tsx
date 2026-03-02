import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { RequirementMatch } from '@/interface/candidate';

interface CandidateRequirementDetailProps {
    requirements?: RequirementMatch[];
    candidateName?: string;
    onViewProfile?: () => void;
}

const CandidateRequirementDetail: React.FC<CandidateRequirementDetailProps> = ({ 
    requirements = [], 
    candidateName = 'Candidate',
    onViewProfile 
}) => {
    if (!requirements || requirements.length === 0) {
        return (
            <Box p={3} sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
                 <Typography variant="body2" color="text.secondary">No match data available.</Typography>
            </Box>
        );
    }

    return (
        <Paper 
            elevation={0} 
            sx={{ 
                p: 3, 
                m: 2, 
                border: '1px solid', 
                borderColor: 'divider', 
                borderRadius: 2,
            }}
        >
            {/* Header Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box sx={{ 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        p: 0.5, 
                        borderRadius: 1, 
                        display: 'flex' 
                    }}>
                        <AssessmentIcon fontSize="small" />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Requirement Match: {candidateName}
                    </Typography>
                </Box>
                {onViewProfile && (
                     <Button 
                        size="small" 
                        onClick={onViewProfile}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                        View Full Profile
                    </Button>
                )}
            </Box>

            {/* Column Headers */}
            <Box sx={{ display: 'flex', gap: 4, mb: 2, px: 2 }}>
                <Box sx={{ flex: 1 }}>
                     <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                        JOB REQUIREMENT
                    </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 0.5 }}>
                        CANDIDATE RESPONSE
                    </Typography>
                </Box>
            </Box>

            {/* Rows */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {requirements.map((req, index) => {
                    // Logic
                    const isPassed = req.is_linear ? req.candidate_rank >= req.required_rank : req.candidate_rank === req.required_rank;
                    const isCritical = req.weight_score === 100;
                    
                    // Left Side Data
                    const jobTitle = req.skill_name || req.category_label || 'Requirement';
                    const jobDesc = req.skill_name ? req.category_label : ''; 
                    const jobValue = req.required_label;

                    // Right Side Data
                    const candTitle = req.candidate_label || 'Not Provided';
                    const candDesc = isPassed ? "Meets or exceeds requirement" : "Does not meet requirement";

                    // Styles
                    const leftBorderColor = '#1976d2'; 
                    const leftBgColor = '#FAFBFC'; 
                    
                    const rightBorderColor = isPassed ? '#2e7d32' : '#d32f2f'; 
                    const rightBgColor = isPassed ? '#F1F8E9' : '#FFEBEE'; 
                    const rightTitleColor = isPassed ? '#1b5e20' : '#c62828';
                    const rightDescColor = isPassed ? '#33691e' : '#b71c1c';

                    return (
                        <Box key={index} sx={{ display: 'flex', gap: 4, alignItems: 'stretch' }}>
                            {/* Job Requirement Card */}
                            <Box sx={{ 
                                flex: 1,
                                width: '50%', // Force 50% width
                                borderLeft: `4px solid ${leftBorderColor}`,
                                bgcolor: leftBgColor,
                                p: 2,
                                borderRadius: '0 4px 4px 0', 
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
                                        {jobTitle}
                                    </Typography>
                                    {isCritical && (
                                        <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 700, border: '1px solid', borderColor: 'error.main', px: 0.5, borderRadius: 0.5, ml: 1 }}>
                                            CRITICAL
                                        </Typography>
                                    )}
                                </Box>
                                
                                {jobDesc && (
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                        {jobDesc}
                                    </Typography>
                                )}
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Required: <strong>{jobValue}</strong>
                                </Typography>
                            </Box>

                            {/* Candidate Response Card */}
                             <Box sx={{ 
                                flex: 1,
                                width: '50%', // Force 50% width
                                borderLeft: `4px solid ${rightBorderColor}`,
                                bgcolor: rightBgColor,
                                p: 2,
                                borderRadius: '0 4px 4px 0',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ color: rightTitleColor, mb: 0.5 }}>
                                    {candTitle} (Rank {req.candidate_rank})
                                </Typography>
                                <Typography variant="body2" sx={{ color: rightDescColor }}>
                                    {candDesc}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Paper>
    );
};

export default CandidateRequirementDetail;
