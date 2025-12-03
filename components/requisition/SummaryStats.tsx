import React from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      border: '1px solid',
      borderColor: 'divider',
    }}
  >
    <Typography variant="body2" color="text.secondary" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4" component="div" fontWeight="500">
      {value}
    </Typography>
  </Paper>
);

const SummaryStats = () => {
  const stats = [
    { title: 'Total Requisitions', value: 'X' },
    { title: 'Pending Review', value: 'X' },
    { title: 'Approved', value: 'X' },
    { title: 'In Progress', value: 'X' },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
          <StatCard title={stat.title} value={stat.value} />
        </Grid>
      ))}
    </Grid>
  );
};

export default SummaryStats;
