"use client"
import { getAllCandidates } from "@/api/candidate";
import CandidateTable from "@/components/candidates/CandidateTable";
import Filters from "@/components/Filters";
import RequisitionFilters from "@/components/Filters";
import SummaryStats from "@/components/SummaryStats";
import { CandidateProfile } from "@/interface/candidate";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const CandidatesPage = () => { 
  const [candidates, setCandidates] = useState<Partial<CandidateProfile>[]>([]);
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

  const fetchAllCandidates = async() => { 
    try{ 
      console.log('in the fetch all candidates')
      const result = await getAllCandidates()
      setCandidates(result)
    }catch(error){ 
      console.log('An error occurred')
    }
  }

  useEffect(() => { 
    fetchAllCandidates()
  }, [])
 
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