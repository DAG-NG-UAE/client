import React from 'react';
import { Box, Typography, Paper, useTheme } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';

interface StatsCardsProps {
  dataSpan: string;
  totalRequisitions: number;
  totalCandidates: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ dataSpan, totalRequisitions, totalCandidates }) => {
  const theme = useTheme();
    return (
    <Paper 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(90deg, #155dfc 0%, #0F4DBA 100%)', // Using primary color gradient
        borderRadius: 3,
        p: 4,
        mb: 6,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
          <CalendarTodayIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Data Span</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{dataSpan}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
          <DescriptionIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Requisitions in Batch</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{totalRequisitions}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ p: 1.5, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
          <GroupIcon sx={{ fontSize: 32 }} />
        </Box>
        <Box>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Candidates in Batch</Typography>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>{totalCandidates}</Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StatsCards;
