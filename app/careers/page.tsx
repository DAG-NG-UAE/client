import React from 'react';
import { Container, Typography, Box, Button, Grid, Card, CardContent } from '@mui/material';

export default function CareersPage() {
  // Mock data for jobs
  const jobs = [
    { id: 1, title: 'Senior Software Engineer', department: 'Engineering', location: 'Remote' },
    { id: 2, title: 'Product Manager', department: 'Product', location: 'New York, NY' },
    { id: 3, title: 'UX Designer', department: 'Design', location: 'London, UK' },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Join Our Team
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Explore exciting opportunities and build the future with us.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {jobs.map((job) => (
          <Grid size={{ xs: 12, md: 4 }} key={job.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {job.title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {job.department}
                </Typography>
                <Typography variant="body2">
                  {job.location}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button size="small" variant="contained">Apply Now</Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
