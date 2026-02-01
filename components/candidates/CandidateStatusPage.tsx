"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material'; // Import IconButton
import { useRouter } from 'next/navigation';
import AssignmentIcon from '@mui/icons-material/Assignment';

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
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FolderIcon from '@mui/icons-material/Folder';
import ArchiveIcon from '@mui/icons-material/Archive';


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
  const router = useRouter();
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

  const hasActions = true;

  const allYears = [
    { text: 'All years', value: 'all'}, 
    { text: '2025', value: '2025'}
  ]

  const handleRowClick = (candidate:Partial<CandidateProfile>) =>{
    dispatch(setSelectedCandidate(candidate))
    setIsModalOpen(true);
  }

  const renderActions = (candidate: Partial<CandidateProfile>) => {
    let specificAction = null;

    // Determine specific action based on status and role
    if (status === 'pending_feedback') {
      if (user?.role_name === AppRole.Recruiter) {
        specificAction = <PingHiringManagersButton candidate={candidate}/>;
      } else {
        specificAction = <FillInterviewFormButton candidate={candidate}/>; 
      }
    } else if (status === 'approved_for_offer' && user?.role_name === AppRole.HeadOfHr) {
       specificAction = <GenerateOfferLetterButton candidate={candidate} />;
    } else if (status === 'pre_offer') {
       specificAction = (
           <Tooltip title="Pre-Offer Documents">
             <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/candidates/pre-offer/${candidate.candidate_id}`);
                }}
                color="primary"
             >
               <AssignmentIcon />
             </IconButton>
           </Tooltip>
       );
    } else if (status === 'internal_salary_proposal') {
       specificAction = (
           <Tooltip title="Internal Salary Proposal">
             <IconButton 
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/candidates/internal-salary-proposal/${candidate.candidate_id}`);
                }}
                color="primary"
             >
               <AssignmentIcon />
             </IconButton>
           </Tooltip>
       );
    } else if(status === 'offer_accepted'){
      specificAction = (
        <Tooltip title="View Details">
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              dispatch(setSelectedCandidate(candidate))
              router.push(`/offers/view/${candidate.offer_id}`);
            }}
            color="primary"
          >
            <AssignmentIcon />
          </IconButton>
        </Tooltip>
      )
    } else if (status === 'offer_rejected'){ 
      specificAction = (
        <>
          <Tooltip title="Redo Proposal">
              <IconButton onClick={(e: React.MouseEvent) => { 
                  e.stopPropagation(); 
                  if(candidate.candidate_id) {
                      router.push(`/candidates/internal-salary-proposal/${candidate.candidate_id}`);
                  }
              }}>
                  <RestartAltIcon color="primary" />
              </IconButton>
          </Tooltip>
          <Tooltip title="Move to Regretted">
              <IconButton >
                  <FolderIcon color="error" />
              </IconButton>
          </Tooltip>
          <Tooltip title="Keep for another opening">
                <IconButton >
                  <ArchiveIcon color="warning" />
              </IconButton>
          </Tooltip>
        </>
      )
    }

    // Always render the base actions (View, Move, Delete) with the specific action injected
    return (
        <AppliedActionsStub 
            candidate={candidate}
             onMove={(c) => handleRowClick(c)} // This opens the modal
             onView={(c) =>{
               dispatch(setSelectedCandidate(c))
               router.push(`/candidates/view/${c.candidate_id}`)
             }}
             onDelete={(c) => console.log('Delete', c)} // Placeholder
        >
            {specificAction}
        </AppliedActionsStub>
    );
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
                      onViewProfile={() => router.push(`/candidates/view/${row.candidate_id}`)}
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