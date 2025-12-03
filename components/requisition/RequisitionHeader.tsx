import { Box, Typography, Button, IconButton, Stack } from '@mui/material';
import { ArrowBack, Edit } from '@mui/icons-material';
import Link from 'next/link';

interface RequisitionHeaderProps {
  title: string;
  requisitionId: string | undefined;
  isEditMode?: boolean;
}

const RequisitionHeader = ({ title, requisitionId, isEditMode = false }: RequisitionHeaderProps) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Button
        component={Link}
        href={isEditMode ? `/requisition/${requisitionId}` : '/requisition'}
        startIcon={<ArrowBack />}
        sx={{ 
          mb: 2, 
          color: 'text.secondary',
          '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' }
        }}
      >
        {isEditMode ? 'Back to View' : 'Back to Requisitions'}
      </Button>
      
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Requisition #{requisitionId}
          </Typography>
        </Box>
        
        {!isEditMode && (
          <Button
            component={Link}
            href={`/requisition/${requisitionId}/edit`}
            variant="contained"
            startIcon={<Edit />}
            sx={{ textTransform: 'none' }}
          >
            Edit Requisition
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default RequisitionHeader;
