"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material'; // Import IconButton

import SummaryStats from '@/components/SummaryStats';
import CandidateTable from '@/components/candidates/CandidateTable';
import { statusDetails } from '@/utils/constants';
import { CandidateProfile } from '@/interface/candidate';
import { getAllCandidates } from '@/api/candidate';
import Filters from '../Filters';
import { useAppDispatch, useAppSelector } from '@/store/hooks'; // Import useAppDispatch
import { selectAllPositions, fetchPositions } from '@/store/features/positionsSlice'; // Import fetchPositions


interface CandidateStatusPageProps {
  status: string;
}

// Mock data for summary stats
const summaryData = [
  { title: "Total Candidates", value: "150" },
  { title: "New This Week", value: "25" },
  { title: "Pending Review", value: "10" },
];

const CandidateStatusPage  = ({status}: CandidateStatusPageProps) => {
  const details = statusDetails[status] || { title: 'Candidates', subtitle: 'Manage all candidates.' };
  const [candidates, setCandidates] = useState<Partial<CandidateProfile>[]>([]);
  const dispatch = useAppDispatch(); // Initialize dispatch
  const positions = useAppSelector(selectAllPositions);
  

  const allRoles = [
    { text: 'All Roles', value: 'all' },
    ...positions.map((position) => ({
      text: position.position,
      value: position.requisition_id,
    })),
  ];

  const allYears = [
    { text: 'All years', value: 'all'}, 
    { text: '2025', value: '2025'}
  ]

  const fetchCandidates = async(requisitionId?: string) => { 
    try{ 
      const response  = await getAllCandidates(requisitionId, status)
      setCandidates(response.mainResult)
    }catch(error){ 
      console.log('there was an error fetching the candidate for the stage ')
    }
  }

  const handleYearChange = async(year: string) => {
    console.log(`Filtering by year => ${year}`);
    // You can add logic to filter candidates by year here
  }

  const handleRefreshPositions = () => {
    dispatch(fetchPositions());
  };

  useEffect(() => { 
    if (status) {
      fetchCandidates();
    }
  }, [status])

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {details.title}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {details.subtitle}
      </Typography>

      <SummaryStats stats={summaryData} />

      
        <Filters 
            menuItems={allRoles} 
            textPlaceholder="Search candidate..." 
            isCandidate={true} 
            allYears={allYears}
            refreshPosition={handleRefreshPositions}
            filterFunction={fetchCandidates}
            onYearChange={handleYearChange}
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