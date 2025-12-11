import { Box, Typography, Grid, Paper, Chip } from '@mui/material';
import { Requisition } from '@/interface/requisition';
import { getStatusChipProps } from '@/utils/statusColorMapping';

interface CoreDetailsProps {
  requisition: Partial<Requisition>;
}

const DetailItem = ({ label, value, isStatus = false }: { label: string; value: string | undefined | number; isStatus?: boolean }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
      {label}
    </Typography>
    {isStatus && typeof value === 'string' ? (
       (<Chip 
          {...getStatusChipProps(value)} 
          size="small" 
          sx={{ 
            borderRadius: '6px', 
            fontWeight: 500,
            ...(getStatusChipProps(value).sx || {})
          }}
        />) 
    ) : (
      <Typography variant="body2" fontWeight={500}>
        {value || '-'}
      </Typography>
    )}
  </Box>
);

const CoreDetails = ({ requisition }: CoreDetailsProps) => {
  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        Core Requisition Details
      </Typography>
      
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Internal Job Title" value={requisition.position} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Department" value={requisition.department} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Hiring Manager" value={requisition.requisition_raised_by} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
           {/* Placeholder for Requester if needed, or just empty */}
           <DetailItem label="Requester" value={requisition.requisition_raised_by} />
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Headcount" value={requisition.num_positions} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Budget" value={requisition.proposed_salary} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DetailItem label="Status" value={requisition.status} isStatus />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default CoreDetails;
