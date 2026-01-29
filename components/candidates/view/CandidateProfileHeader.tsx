import React, { useState } from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { CandidateProfile } from '@/interface/candidate';
import { getStatusChipProps } from '@/utils/statusColorMapping';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CandidateModal from '../CandidateModal';
import { dispatch } from '@/redux/dispatchHandle';
import { fetchSingleCandidate, setSelectedCandidate } from '@/redux/slices/candidates';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AppRole } from '@/utils/constants';

interface Props {
    candidate: CandidateProfile;
}

const CandidateProfileHeader: React.FC<Props> = ({ candidate }) => {
    const statusProps = getStatusChipProps(candidate.current_status);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {user} = useSelector((state: RootState) => state.auth);
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        //when the modal closes we want to refetch the candidate data
        fetchSingleCandidate(candidate.candidate_id)
      };

    const handleRowClick = (candidate:Partial<CandidateProfile>) =>{
        dispatch(setSelectedCandidate(candidate))
        setIsModalOpen(true);
      }

    console.log(`candidate in the candidate profile header => ${JSON.stringify(candidate)}`)

    return (
        <>
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

            {(user?.role_name == AppRole.HeadOfHr || user?.role_name == AppRole.HrManager) && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
                 <Button 
                    variant="outlined" 
                    color="inherit" 
                    startIcon={<CloseIcon />}
                    sx={{ textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.secondary' }}
                 >
                    Reject
                 </Button>
                 {candidate.current_status == "shortlisted" && (
                 <Button 
                    variant="outlined" 
                    color="inherit"
                    startIcon={<CalendarMonthIcon />}
                    sx={{ textTransform: 'none', fontWeight: 600, borderColor: 'divider', color: 'text.primary' }}
                    onClick={() => handleRowClick(candidate)}
                 >
                    Schedule
                 </Button>
                 )}
                 <Button 
                    variant="contained" 
                    color="primary"
                    endIcon={<ArrowForwardIcon />}
                    sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
                    onClick={() => handleRowClick(candidate)}
                 >
                    Move Stage
                 </Button>
            </Box>
            )}
        </Box>
        <CandidateModal
          open={isModalOpen}
          onClose={handleCloseModal}
          candidate={candidate}
        />
        </>
        
    );
};

export default CandidateProfileHeader;
