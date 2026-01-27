import React from 'react';
import { Box, Typography, Avatar, Paper, Chip } from '@mui/material';
import { CandidateProfile } from '@/interface/candidate';
import { getFirstAndLastInitials } from '@/utils/transform';
import SchoolIcon from '@mui/icons-material/School';

interface Props {
    candidate: CandidateProfile;
}

const CandidateSidebar: React.FC<Props> = ({ candidate }) => {
    // Extract Skills from requirement_match if available
    const skills = candidate.requirement_match
        ?.filter(r => r.skill_name) // Only items with explicit skill names
        .map(r => r.skill_name) || [];
    
    // Deduplicate skills
    const uniqueSkills = Array.from(new Set(skills));

    return (
        <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: 'fit-content' }}>
            {/* Avatar Section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Avatar 
                    src={candidate.cv_path?.includes('.jpg') ? candidate.cv_path : undefined} // Naive check, likely using initials
                    sx={{ width: 100, height: 100, bgcolor: 'primary.light', fontSize: '2.5rem', fontWeight: 600, color: 'primary.main', mb: 2 }}
                >
                    {getFirstAndLastInitials(candidate.candidate_name)}
                </Avatar>
            </Box>

            {/* Education */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, mb: 2, display: 'block' }}>
                    EDUCATION
                </Typography>
                <Box sx={{ display: 'flex', gap: 1.5, mb: 1 }}>
                     <SchoolIcon color="action" fontSize="small" sx={{ mt: 0.5 }} />
                     <Box>
                        <Typography variant="subtitle2" fontWeight={700}>
                            {candidate.qualification || 'Not Specified'}
                        </Typography>
                         {/* Optional: Institution would be here if we had it */}
                        <Typography variant="caption" color="text.secondary">
                           Highest Qualification
                        </Typography>
                     </Box>
                </Box>
            </Box>

            {/* Key Skills */}
            <Box>
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ letterSpacing: 1, mb: 2, display: 'block' }}>
                    KEY SKILLS
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {uniqueSkills.length > 0 ? (
                        uniqueSkills.map((skill, index) => (
                            <Chip 
                                key={index} 
                                label={skill} 
                                size="small" 
                                sx={{ 
                                    bgcolor: 'action.hover', 
                                    fontWeight: 500, 
                                    borderRadius: 1 
                                }} 
                            />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">No skills listed</Typography>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};

export default CandidateSidebar;
