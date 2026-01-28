import React from 'react';
import { Box, Typography, Paper, Avatar, Rating } from '@mui/material';
import { CandidateEvaluationPayload, CandidateProfile } from '@/interface/candidate';
import MatchScore from '../MatchScore';
import EventIcon from '@mui/icons-material/Event';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/Download';
import { getFirstAndLastInitials } from '@/utils/transform';

interface Props {
    candidate: CandidateProfile;
    evaluations: CandidateEvaluationPayload[];
}

const CandidateRightSidebar: React.FC<Props> = ({ candidate, evaluations }) => {
    
    // Calculate overall average
    const calculateOverallAverage = () => {
        if (!evaluations || evaluations.length === 0) return "N/A";
        
        // Sum all numerical ratings
        const total = evaluations.reduce((acc, curr) => {
             // Parse "5.0/5.0" -> 5.0
            const score = parseFloat(curr.candidate_overall_avg.split('/')[0]);
            return acc + (isNaN(score) ? 0 : score);
        }, 0);

        const avg = total / evaluations.length;
        return `${avg.toFixed(1)} / 5.0`;
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Match Score Card */}
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, mb: 3 }}>
                    MATCH SCORE
                </Typography>
                <Box sx={{ transform: 'scale(1.5)', mb: 2, mt: 1 }}>
                     <MatchScore score={candidate.match_score || 0} requirements={candidate.requirement_match} />
                </Box>
                 <Typography variant="caption" color="text.secondary" align="center" sx={{ mt: 2, px: 2, lineHeight: 1.5 }}>
                    Based on JD keywords, skill matching, and location requirements.
                </Typography>
            </Paper>

            {/* Reviewer Ratings */}
             <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1 }}>
                        REVIEWER RATINGS
                    </Typography>
                     <Typography variant="body2" fontWeight={700}>{calculateOverallAverage()}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                     {evaluations && evaluations.length > 0 ? (
                        evaluations.map((evalItem) => {
                             const score = parseFloat(evalItem.candidate_overall_avg.split('/')[0]);
                             return (
                                <Box key={evalItem.interviewer_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                                            {getFirstAndLastInitials(evalItem.interviewer_name)}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight={500}>{evalItem.interviewer_name}</Typography>
                                    </Box>
                                    <Rating value={isNaN(score) ? 0 : score} precision={0.5} size="small" readOnly sx={{ fontSize: '0.9rem' }} />
                                </Box>
                             );
                        })
                     ) : (
                        <Typography variant="body2" color="text.secondary" align="center">No evaluations yet.</Typography>
                     )}
                </Box>
            </Paper>

             {/* Upcoming Tasks (Mock) */}
             {/* <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, mb: 2, display: 'block' }}>
                    UPCOMING TASKS
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ bgcolor: 'primary.50', p: 1.5, borderRadius: 2, display: 'flex', gap: 1.5 }}>
                        <Box sx={{ bgcolor: 'primary.main', borderRadius: 1, p: 0.5, color: 'white', display: 'flex', alignItems: 'center' }}>
                            <EventIcon fontSize="small" />
                        </Box>
                        <Box>
                             <Typography variant="subtitle2" fontWeight={600}>Panel Interview</Typography>
                             <Typography variant="caption" color="text.secondary">Tomorrow, 10:30 AM</Typography>
                        </Box>
                    </Box>

                     <Box sx={{ border: '1px solid', borderColor: 'divider', p: 1.5, borderRadius: 2, display: 'flex', gap: 1.5 }}>
                        <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                            <AssignmentIcon fontSize="small" />
                        </Box>
                        <Box>
                             <Typography variant="subtitle2" fontWeight={600}>Reference Check</Typography>
                             <Typography variant="caption" color="text.secondary">Due in 2 days</Typography>
                        </Box>
                    </Box>

                    <Box sx={{ border: '1px solid', borderColor: 'divider', p: 1.5, borderRadius: 2, display: 'flex', gap: 1.5 }}>
                        <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                            <DownloadIcon fontSize="small" />
                        </Box>
                        <Box>
                             <Typography variant="subtitle2" fontWeight={600}>Background Doc</Typography>
                             <Typography variant="caption" color="text.secondary">Awaiting candidate</Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper> */}

        </Box>
    );
};

export default CandidateRightSidebar;
