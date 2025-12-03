import { Box, Typography, Paper } from '@mui/material';
import { PeopleOutline } from '@mui/icons-material';
import { Requisition } from '@/interface/requisition';

interface TotalApplicantsProps {
  requisition: Partial<Requisition>;
}

const TotalApplicants = ({ requisition }: TotalApplicantsProps) => {
  return (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <PeopleOutline sx={{ mr: 1, color: 'text.secondary' }} />
        <Typography variant="h6" fontWeight={500}>
          Total Applicants
        </Typography>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 4 }}>
        <Typography variant="h2" color="primary.main" fontWeight={500} sx={{ mb: 1 }}>
          {requisition.applicants}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Total applications received
        </Typography>
      </Box>
      
      <Box sx={{ mt: 'auto', textAlign: 'center' }}>
          <Typography variant="button" color="primary" sx={{ cursor: 'pointer', textTransform: 'none', '&:hover': { textDecoration: 'underline' } }}>
              View all applicants →
          </Typography>
      </Box>
    </Paper>
  );
};

export default TotalApplicants;
