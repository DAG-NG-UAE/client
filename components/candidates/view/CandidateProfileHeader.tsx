import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { CandidateProfile } from '@/interface/candidate';
import { getStatusChipProps } from '@/utils/statusColorMapping';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Props {
    candidate: CandidateProfile;
}

const CandidateProfileHeader: React.FC<Props> = ({ candidate }) => {
    const statusProps = getStatusChipProps(candidate.current_status);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                    <Typography variant="h4" fontWeight={800} sx={{ color: 'text.primary' }}>
                        {candidate.candidate_name}
                    </Typography>
                    {candidate.current_status && (
                        <Chip 
                            {...statusProps} 
                            size="small" 
                            sx={{ ...statusProps.sx, fontWeight: 700, textTransform: 'uppercase', height: 24 }} 
                        />
                    )}
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Applied for <Box component="span" fontWeight={600} color="text.primary">{candidate.role_applied_for}</Box>
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
                 <Button 
                    variant="outlined" 
                    color="inherit" 
                    startIcon={<CloseIcon />}
                    sx={{ textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.secondary' }}
                 >
                    Reject
                 </Button>
                 <Button 
                    variant="outlined" 
                    color="inherit"
                    startIcon={<CalendarMonthIcon />}
                    sx={{ textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}
                 >
                    Schedule
                 </Button>
                 <Button 
                    variant="contained" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
                 >
                    Move Stage
                 </Button>
            </Box>
        </Box>
    );
};

export default CandidateProfileHeader;
