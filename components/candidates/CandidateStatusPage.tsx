"use client";

import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material'; // Import IconButton
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import AssignmentIcon from '@mui/icons-material/Assignment';

import SummaryStats from '@/components/SummaryStats';
import { AppRole, statusDetails } from '@/utils/constants';
import { RootState, useSelector } from '@/redux/store';
import { fetchPositions } from '@/redux/slices/positions';
import { fetchAllCandidates, setSelectedCandidate, clearSelectedCandidate, callCancelInterview, callBulkUpdateCandidateStatus } from '@/redux/slices/candidates';
import TableComponent from '../Table/Table';
import { getColumnsForStatus } from '@/utils/candidateColumnConfig';
import { CandidateProfile } from '@/interface/candidate';
import { dispatch } from '@/redux/dispatchHandle';
import CandidateModal from './CandidateModal';
import { FillInterviewFormButton, PingHiringManagersButton, GenerateOfferLetterButton, AppliedActionsStub } from './CandidateRowActions';
import Filters from '../Filters';
import CandidateRequirementDetail from './CandidateRequirementDetail';
import CandidateSelectionTray from './CandidateSelectionTray';
import CandidateMoveRequisitionModal from './CandidateMoveRequisitionModal';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FolderIcon from '@mui/icons-material/Folder';
import ArchiveIcon from '@mui/icons-material/Archive';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import EventBusyIcon from '@mui/icons-material/EventBusy';


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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requisitionIdFromUrl = searchParams.get('requisitionId') ?? undefined;
  const details = statusDetails[status] || { title: 'Candidates', subtitle: 'Manage all candidates.' };

  const {positions} = useSelector((state: RootState) => state.positions)
  console.log('positions =>>> ', positions )
  const {candidates, selectedCandidate, meta, error} = useSelector((state:RootState) => state.candidates)
  const {user} = useSelector((state:RootState) => state.auth)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    dispatch(clearSelectedCandidate());
  };

  // Persistent tray selection — Map survives searches/filter changes
  const [selectedCandidates, setSelectedCandidates] = useState<Map<string, Partial<CandidateProfile>>>(new Map());

  const handleToggleSelect = (_id: any, row: Partial<CandidateProfile>) => {
    const id = row.candidate_id!;
    setSelectedCandidates(prev => {
      const next = new Map(prev);
      next.has(id) ? next.delete(id) : next.set(id, row);
      return next;
    });
  };

  const handleRemoveFromTray = (candidateId: string) => {
    setSelectedCandidates(prev => {
      const next = new Map(prev);
      next.delete(candidateId);
      return next;
    });
  };

  const handleClearTray = () => setSelectedCandidates(new Map());

  const [isMoveRequisitionModalOpen, setIsMoveRequisitionModalOpen] = useState(false);

  const handleBulkMoveToRequisition = async (
    _targetRequisitionId: string,
    payload: Array<{ candidate_id: string; old_status: string; new_status: string; requisition_id: string }>
  ) => {
    await callBulkUpdateCandidateStatus(payload);
    setSelectedCandidates(new Map());
    if (requisitionIdFromUrl) {
      fetchAllCandidates(requisitionIdFromUrl, undefined)
    } else if (status) {
      fetchAllCandidates(undefined, status)
    }
  };

  const handleBulkMove = async (targetStage: string) => {
    const updates = Array.from(selectedCandidates.values()).map(c => ({
      candidate_id: c.candidate_id,
      requisition_id: c.requisition_id,
      email: c.email,
      old_status: c.current_status,
      new_status: targetStage,
      current_status: targetStage,
    }));
    await callBulkUpdateCandidateStatus(updates);
    setSelectedCandidates(new Map());
    if (requisitionIdFromUrl) {
      fetchAllCandidates(requisitionIdFromUrl, undefined)
    } else if (status) {
      fetchAllCandidates(undefined, status)
    }
  };

  console.log(`the candidates are => ${JSON.stringify(candidates)}`)
  useEffect(() => {
    fetchPositions();
  }, []);

  useEffect(() => {
    if (requisitionIdFromUrl) {
      fetchAllCandidates(requisitionIdFromUrl, undefined)
    } else if (status) {
      fetchAllCandidates(undefined, status)
    }
  }, [status, requisitionIdFromUrl])

  const allRoles = [
    { text: 'All Roles', value: 'all' },
    ...positions.map((position) => ({
      text: position.position,
      value: position.requisition_id,
    })),
  ];

  const candidateStatusItems = [
    { text: 'All Statuses', value: 'all' },
    { text: 'Applied', value: 'applied' },
    { text: 'Screened', value: 'screened' },
    { text: 'Shortlisted', value: 'shortlisted' },
    { text: 'Interview Scheduled', value: 'interview_scheduled' },
    { text: 'Interviewed', value: 'interviewed' },
    { text: 'Pending Feedback', value: 'pending_feedback' },
    { text: 'Pre-Offer', value: 'pre_offer' },
    { text: 'Internal Salary Proposal', value: 'internal_salary_proposal' },
    { text: 'Approved for Offer', value: 'approved_for_offer' },
    { text: 'Offer Extended', value: 'offer_extended' },
    { text: 'Offer Accepted', value: 'offer_accepted' },
    { text: 'Offer Rejected', value: 'offer_rejected' },
    { text: 'Rejected', value: 'rejected' },
    { text: 'Hired', value: 'hired' },
  ];

  const hasActions = true;

  const allYears = [
    { text: 'All years', value: 'all' },
    { text: '2025', value: '2025' },
  ];

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
    } else if (status === 'interview_scheduled') {
      specificAction = (
        <>
          {/* <Tooltip title="Reschedule Interview">
            <IconButton onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              dispatch(setSelectedCandidate(candidate));
              router.push(`/candidates/schedule`);
            }}>
              <EventRepeatIcon color="primary" fontSize="small" />
            </IconButton>
          </Tooltip> */}
          <Tooltip title="Cancel Interview">
            <IconButton onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (candidate.interview_id) callCancelInterview(candidate.interview_id);
            }}>
              <EventBusyIcon color="error" fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
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
          {/* <Tooltip title="Move to Regretted">
              <IconButton >
                  <FolderIcon color="error" />
              </IconButton>
          </Tooltip>
          <Tooltip title="Keep for another opening">
                <IconButton >
                  <ArchiveIcon color="warning" />
              </IconButton>
          </Tooltip> */}
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
             user={user}
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


  

  const [selectedRole, setSelectedRole] = useState(requisitionIdFromUrl ?? 'all');

  const searchRef = React.useRef('');

  const handleSearch = React.useCallback((query: string) => {
    searchRef.current = query;
    fetchAllCandidates(selectedRole === 'all' ? undefined : selectedRole, status, 1, 10, query);
  }, [selectedRole, status]);

  const handleFilterChange = (requisitionId: string) => {
    setSelectedRole(requisitionId);
    searchRef.current = '';
    if (requisitionId === 'all') {
      router.push(pathname);
    } else {
      router.push(`${pathname}?requisitionId=${encodeURIComponent(requisitionId)}`);
    }
  };

  const handleStatusChange = (newStatus: string) => {
    router.push(`/candidates/${newStatus}`);
  };

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
              statusMenuItems={candidateStatusItems}
              defaultFilterValue={requisitionIdFromUrl ?? 'all'}
              refreshPosition={handleRefreshPositions}
              filterFunction={handleFilterChange}
              onStatusChange={handleStatusChange}
              onYearChange={handleYearChange}
              onSearch={handleSearch}
          />
          


        {candidates && (
          <Box sx={{ mt: 4, pb: selectedCandidates.size > 0 ? 10 : 0 }}>
            <TableComponent
              columns={getColumnsForStatus(status)}
              data={candidates}
              renderDetailPanel={(row) => (
                <CandidateRequirementDetail
                  requirements={row.requirement_match}
                  candidateName={row.candidate_name}
                  onViewProfile={() => router.push(`/candidates/view/${row.candidate_id}`)}
                />
              )}
              selectedIds={Array.from(selectedCandidates.keys())}
              onToggleSelect={handleToggleSelect}
              actions={hasActions ? renderActions : undefined}
              error={error}
              onRetry={() => fetchAllCandidates(undefined, status)}
              keyExtractor={(c) => c.candidate_id}
              totalCount={meta?.total || 0}
              page={(meta?.page || 1) - 1}
              rowsPerPage={meta?.limit || 10}
              onPageChange={(e, newPage) => requisitionIdFromUrl ? fetchAllCandidates(requisitionIdFromUrl, status, newPage + 1, meta?.limit) : fetchAllCandidates(undefined, status, newPage + 1, meta?.limit) }
              onRowsPerPageChange={(e) => requisitionIdFromUrl ?  fetchAllCandidates(requisitionIdFromUrl, status, 1, parseInt(e.target.value, 10)) : fetchAllCandidates(undefined, status, 1, parseInt(e.target.value, 10))}
            />
          </Box>
        )}

      </Box>

      <CandidateModal
        open={isModalOpen}
        onClose={handleCloseModal}
        candidate={selectedCandidate}
      />

      <CandidateSelectionTray
        selectedCandidates={selectedCandidates}
        onRemove={handleRemoveFromTray}
        onClear={handleClearTray}
        onMove={handleBulkMove}
        onMoveToRequisition={() => setIsMoveRequisitionModalOpen(true)}
      />

      <CandidateMoveRequisitionModal
        open={isMoveRequisitionModalOpen}
        onClose={() => setIsMoveRequisitionModalOpen(false)}
        selectedCandidates={selectedCandidates}
        onMove={handleBulkMoveToRequisition}
      />
    </>
  );
};

export default CandidateStatusPage;