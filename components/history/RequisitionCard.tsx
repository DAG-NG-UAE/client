import React from 'react';
import { Box, Typography, Button, Card, CardContent, Divider, Chip, useTheme } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import UploadFileIcon from '@mui/icons-material/UploadFile';

interface RequisitionCardProps {
  id: string;
  role: string;
  department: string;
  candidateCount: number;
  status: 'Open' | 'Closed' | 'Pending';
}

const RequisitionCard: React.FC<RequisitionCardProps> = ({ id, role, department, candidateCount, status }) => {
  const theme = useTheme();

  return (
    <Card 
      elevation={0} 
      sx={{ 
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        height: '300px',
        width: '300px',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[4]
        },
        display: 'flex', 
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ p: 1, backgroundColor: '#DBEAFE', borderRadius: 2, color: '#155dfc' }}>
            <WorkIcon />
          </Box>
          <Chip 
            label={status} 
            size="small" 
            sx={{ 
              backgroundColor: '#F3F4F6', 
              color: '#4B5563',
              borderRadius: '16px'
            }} 
          />
        </Box>
        
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {role}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {department}
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <GroupIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {candidateCount} candidates(s) linked
          </Typography>
        </Box>

        <Button 
          fullWidth 
          variant="contained" 
          startIcon={<UploadFileIcon />}
          sx={{ 
            mt: 'auto',
            backgroundColor: theme.palette.primary.main,
            '&:hover': { backgroundColor: theme.palette.primary.dark }
          }}
        >
          Upload Candidates
        </Button>
      </CardContent>
    </Card>
  );
};

export default RequisitionCard;
