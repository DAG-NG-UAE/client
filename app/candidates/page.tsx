"use client"
import Filters from "@/components/Filters";
import RequisitionFilters from "@/components/Filters";
import SummaryStats from "@/components/SummaryStats";
import { Box, Container, Stack, Typography } from "@mui/material";

const CandidatesPage = () => { 
  const textPlaceholder = "Search candidate...";
  const allRoles = [
    { text: 'All Roles', value: 'all' },
    { text: 'Data Analyst Intern', value: 'Data Analyst Intern' },
    { text: 'Data Analyst', value: 'Data Analyst' },
    { text: 'Data Engineer', value: 'Data Engineer' },
    { text: 'Data Scientist', value: 'Data Scientist' },
  ];

  const allDepartments = [
    { text: 'All Departments', value: 'all' },
    { text: 'Engineering', value: 'Engineering' },
    { text: 'Product', value: 'Product' }
  ];
  const allYears = [
    { text: 'All years', value: 'all'}, 
    { text: '2025', value: '2025'}
  ]
    return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
              Candidate Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and track all candidate applications
            </Typography>
          </Box>
        </Stack>

        {/* Summary Stats */}
        <SummaryStats stats={[
            { title: 'Total Candidates', value: 'X' },
            { title: 'Applied', value: 'X' },
            { title: 'Screening', value: 'X' },
            { title: 'Interview', value: 'X' },
            { title: 'Offer Stage', value: 'X' },
            { title: 'Hired', value: 'X' },
            { title: 'Rejected', value: 'X' }
          ]} />

        {/* Filters */}
        <Filters 
          menuItems={allRoles} 
          textPlaceholder="Search candidate..." 
          isCandidate={true} 
          allDepartments={allDepartments}
          allYears={allYears}
        />

        {/* Table */}
        
      </Container>
    </Box>
  );
}

export default CandidatesPage