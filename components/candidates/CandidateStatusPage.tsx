"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import SummaryStats from '@/components/SummaryStats';
import CandidateTable from '@/components/candidates/CandidateTable';
import { statusDetails } from '@/utils/constants';
import { CandidateProfile } from '@/interface/candidate';
import { getAllCandidates } from '@/api/candidate';
import Filters from '../Filters';
import { AvailablePositions } from '@/interface/requisition';
import { getPosition } from '@/api/requisitionApi';


interface CandidateStatusPageProps {
  status: string;
  allRoles: {text: string, value:string}[]
}



// Mock data for summary stats
const summaryData = [
  { title: "Total Candidates", value: "150" },
  { title: "New This Week", value: "25" },
  { title: "Pending Review", value: "10" },
];

const CandidateStatusPage  = ({status, allRoles}: CandidateStatusPageProps) => {
  const details = statusDetails[status] || { title: 'Candidates', subtitle: 'Manage all candidates.' };
  const [candidates, setCandidates] = useState<Partial<CandidateProfile>[]>([]);
  

  const allYears = [
    { text: 'All years', value: 'all'}, 
    { text: '2025', value: '2025'}
  ]

  console.log('the status is ', status)
  const fetchCandidates = async() => { 
    try{ 
      
      const response  = await getAllCandidates(undefined, status)
      setCandidates(response.mainResult)
    }catch(error){ 
      console.log('there was an error fetching the candidate for the stage ')
    }
  }


  useEffect(() => { 
    fetchCandidates()
  }, [])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {details.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {details.subtitle}
      </Typography>

      <Box sx={{ my: 4 }}>
        <TextField 
          fullWidth 
          variant="outlined" 
          placeholder="Search for candidates..."
        />
      </Box>

      <SummaryStats stats={summaryData} />

      <Filters 
          menuItems={allRoles} 
          textPlaceholder="Search candidate..." 
          isCandidate={true} 
          allYears={allYears}
      />

      {candidates && (
        <Box sx={{ mt: 4 }}>
          <CandidateTable candidates={candidates} />
        </Box>
      )}
     
    </Box>
  );
};

export default CandidateStatusPage;