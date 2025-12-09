"use client"
import CandidateTable from "@/components/candidates/CandidateTable";
import Filters from "@/components/Filters";
import RequisitionFilters from "@/components/Filters";
import SummaryStats from "@/components/SummaryStats";
import { CandidateProfile } from "@/interface/candidate";
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

  const candidates: Partial<CandidateProfile>[] = [
    {
      candidate_id: '1',
      candidate_name: 'John Doe',
      role_applied_for: 'Data Analyst',
      department: 'Engineering',
      submitted_date: '2023-10-15',
      total_experience_years: '2',
      source: 'LinkedIn',
      current_status: 'Applied',
      email: 'john.doe@example.com',
      mobile_number: '1234567890',
      location: 'New York',
      privacy_consent: true,
      cover_letter: 'This is a cover letter',
      cv_path: 'path/to/cv.pdf',
    }, 
    {
      candidate_id: '2',
      candidate_name: 'Jane Smith',
      role_applied_for: 'Data Engineer',
      department: 'Engineering',
      submitted_date: '2023-10-16',
      total_experience_years: '3',
      source: 'Indeed',
      current_status: 'Shortlisted',
      email: 'jane.smith@example.com',
      mobile_number: '0987654321',
      location: 'Los Angeles',
      privacy_consent: true,
      cover_letter: 'This is another cover letter',
      cv_path: 'path/to/another_cv.pdf',
    },
    {
      candidate_id: '3',
      candidate_name: 'John Doe',
      role_applied_for: 'Data Analyst',
      department: 'Engineering',
      submitted_date: '2023-10-15',
      total_experience_years: '2',
      source: 'LinkedIn',
      current_status: 'Applied',
      email: 'john.doe@example.com',
      mobile_number: '1234567890',
      location: 'New York',
      privacy_consent: true,
      cover_letter: 'This is a cover letter',
      cv_path: 'path/to/cv.pdf',
    }, 
    {
      candidate_id: '4',
      candidate_name: 'Jane Smith',
      role_applied_for: 'Data Engineer',
      department: 'Engineering',
      submitted_date: '2023-10-16',
      total_experience_years: '3',
      source: 'Indeed',
      current_status: 'Shortlisted',
      email: 'jane.smith@example.com',
      mobile_number: '0987654321',
      location: 'Los Angeles',
      privacy_consent: true,
      cover_letter: 'This is another cover letter',
      cv_path: 'path/to/another_cv.pdf',
    }
  ];
    return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
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
            { title: 'Total Candidates', value: '200' },
            { title: 'Applied', value: '100' },
            { title: 'Screening', value: '50' },
            { title: 'Interview', value: '20' },
            { title: 'Offer Stage', value: '10' },
            { title: 'Hired', value: '5' },
            { title: 'Rejected', value: '5' }
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
        <CandidateTable candidates={candidates} />
        
      </Container>
    </Box>
  );
}

export default CandidatesPage