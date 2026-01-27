"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material'; // Import IconButton

import SummaryStats from '@/components/SummaryStats';
import { AppRole, statusDetails } from '@/utils/constants';
import { RootState, useSelector } from '@/redux/store';
import { fetchPositions } from '@/redux/slices/positions';
import { fetchAllCandidates, setSelectedCandidate, clearSelectedCandidate } from '@/redux/slices/candidates';
import TableComponent from '../Table/Table';
import { getColumnsForStatus } from '@/utils/candidateColumnConfig';
import { CandidateProfile } from '@/interface/candidate';
import { dispatch } from '@/redux/dispatchHandle';
import CandidateModal from './CandidateModal';
import { FillInterviewFormButton, PingHiringManagersButton, GenerateOfferLetterButton, AppliedActionsStub } from './CandidateRowActions';
import Filters from '../Filters';
import CandidateRequirementDetail from './CandidateRequirementDetail';


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

  const {positions} = useSelector((state: RootState) => state.positions)
  const {candidates, selectedCandidate, meta} = useSelector((state:RootState) => state.candidates)
  const {user} = useSelector((state:RootState) => state.auth)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(clearSelectedCandidate()); // Clear selected candidate on modal close
  };

  console.log(`the candidates are => ${JSON.stringify(candidates)}`)
  useEffect(() => { 
    if (status) {
      console.log('on landing to this page are you called?')
      console.log('the status for the candidate is =>', status)
      fetchAllCandidates(undefined, status)
    }
  }, [status])

  const allRoles = [
    { text: 'All Roles', value: 'all' },
    ...positions.map((position) => ({
      text: position.position,
      value: position.requisition_id,
    })),
  ];

  const hasActions = React.useMemo(() => {
    if (status === 'pending_feedback') return true;
    if (status === 'approved_for_offer' && user?.role_name === AppRole.HeadOfHr) return true;
    if (status === 'applied') return true;
    return false;
  }, [status, user?.role_name]);

  const allYears = [
    { text: 'All years', value: 'all'}, 
    { text: '2025', value: '2025'}
  ]

  const handleRowClick = (candidate:Partial<CandidateProfile>) =>{
    dispatch(setSelectedCandidate(candidate))
    setIsModalOpen(true);
  }

  const renderActions = (candidate: Partial<CandidateProfile>) => {
    // Status: Applied
    if (status === 'applied') {
        return (
            <AppliedActionsStub 
                candidate={candidate}
                onMove={(c) => handleRowClick(c)} // This opens the modal
                onView={(c) => console.log('View', c)} // Placeholder or maybe toggle expansion?
                onDelete={(c) => console.log('Delete', c)} // Placeholder
            />
        );
    }

    // Status: Pending Feedback
    if (status === 'pending_feedback') {
      if (user?.role_name === AppRole.Recruiter) {
        return <PingHiringManagersButton candidate={candidate}/>;
      } else {
        return <FillInterviewFormButton candidate={candidate}/>; 
      }
    }

    // Status: Approved for Offer (Head of HR only)
    if (status === 'approved_for_offer' && user?.role_name === AppRole.HeadOfHr) {
       return <GenerateOfferLetterButton candidate={candidate} />;
    }

    return null;
  };

  const handleYearChange = async(year: string) => {
    console.log(`Filtering by year => ${year}`);
    // You can add logic to filter candidates by year here
  }

  const handleRefreshPositions = () => {
    fetchPositions()
  };


  

  // State to track selected role/requisition
  const [selectedRole, setSelectedRole] = useState('all');

  // ... (previous useEffect) ...

  const handleRoleChange = (requisitionId: string) => {
    setSelectedRole(requisitionId);
    fetchAllCandidates(requisitionId, status); // Fetch immediately on role change, resetting search implicitly or we can arguably keep it? 
  };
  
  const searchRef = React.useRef('');

  const handleSearch = React.useCallback((query: string) => {
    searchRef.current = query;
    // When searching, use the currently selected role
    fetchAllCandidates(selectedRole, status, 1, 10, query);
  }, [selectedRole, status]);

  const handleFilterChange = (requisitionId: string) => {
    setSelectedRole(requisitionId);
    // When filtering by role, use the current search query
    fetchAllCandidates(requisitionId, status, 1, 10, searchRef.current);
  }

  return (
    <>
      <Box>
        <Typography variant="h4" gutterBottom>
          {details.title}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {details.subtitle}
        </Typography>

        {/* <SummaryStats stats={summaryData} /> */}

      
          <Filters 
              menuItems={allRoles} 
              textPlaceholder="Search candidate..." 
              isCandidate={true} 
              allYears={allYears}
              refreshPosition={handleRefreshPositions}
              filterFunction={handleFilterChange}
              onYearChange={handleYearChange}
              onSearch={handleSearch}
          />
          


        {candidates && (
          <Box sx={{ mt: 4 }}>
            <TableComponent
              columns={getColumnsForStatus(status)}
              data={candidates}
              // onRowClick={handleRowClick}
              renderDetailPanel={(row) => (
                  <CandidateRequirementDetail 
                      requirements={row.requirement_match} 
                      candidateName={row.candidate_name}
                      onViewProfile={() => handleRowClick(row)}
                  />
              )}
              actions={hasActions ? renderActions : undefined}
              keyExtractor={(candidates) => candidates.candidate_id}
              totalCount={meta?.total || 0}
              page={(meta?.page || 1) - 1} // MUI is 0-indexed
              rowsPerPage={meta?.limit || 10}
              onPageChange={(e, newPage) => fetchAllCandidates(undefined, status, newPage + 1, meta?.limit)}
              onRowsPerPageChange={(e) => fetchAllCandidates(undefined, status, 1, parseInt(e.target.value, 10))}
            >
            </TableComponent>
            {/* <CandidateTable candidates={candidates} status={status} /> */}
          </Box>
        )}
      
      </Box>
      <CandidateModal
          open={isModalOpen}
          onClose={handleCloseModal}
          candidate={selectedCandidate}
        />
    </>
  );
};

export default CandidateStatusPage;