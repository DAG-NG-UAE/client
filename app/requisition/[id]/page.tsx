"use client"

import React, { useEffect, useState } from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useParams } from 'next/navigation';
import RequisitionHeader from '@/components/requisition/RequisitionHeader';
import CoreDetails from '@/components/requisition/CoreDetails';
import JobPostingDetails from '@/components/requisition/JobPostingDetails';
import JobDescription from '@/components/requisition/JobDescription';
import ActivityLog from '@/components/requisition/ActivityLog';
import JobDescriptionHistory from '@/components/requisition/JobDescriptionHistory';
import TotalApplicants from '@/components/requisition/TotalApplicants';
import { Requisition } from '@/interface/requisition';
import { getSingleRequisition } from '@/api/requisitionApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { fetchRequisitionById } from '@/redux/slices/requisition';

// // Mock data generator
// const getMockRequisition = (id: string): Requisition => ({`
//   requisition_id: id,
//   requisition_raised_by: 'Sarah Chen',
//   position: 'Senior Frontend Developer',
//   department: 'Engineering',
//   submitted_date: '2025-11-15',
//   status: 'In Progress',
//   applicants: 24,
//   current_job_description_id: 'JD-001',
//   internal_job_title: 'Senior Frontend Developer',
//   headcount: 2,
//   budget: '$120,000 - $160,000',
//   hiring_manager: 'Sarah Chen',
//   posting_locations: ['San Francisco, CA', 'Remote (US)'],
//   recruiter: 'John Smith',
//   job_description: `
//     <h3>About the Role</h3>
//     <p>We are seeking a talented Senior Frontend Developer to join our growing engineering team...</p>
//     <h3>Responsibilities</h3>
//     <ul>
//       <li>Build responsive web applications</li>
//       <li>Collaborate with design team</li>
//       <li>Mentor junior developers</li>
//     </ul>
//   `,
//   activity_log: [
//     {
//       title: 'Published to careers page',
//       user: 'John Doe',
//       timestamp: 'Nov 16, 12:00 PM'
//     },
//     {
//       title: 'Job description updated',
//       user: 'John Doe',
//       timestamp: 'Nov 16, 11:30 AM'
//     },
//     {
//       title: 'Status changed to In Progress',
//       user: 'Sarah Chen',
//       timestamp: 'Nov 15, 05:00 PM'
//     },
//     {
//       title: 'Requisition created',
//       user: 'Sarah Chen',
//       timestamp: 'Nov 15, 10:00 AM'
//     }
//   ]
// });

const RequisitionViewPage = () => {
  const params = useParams();
  const {loading, selectedRequisition} = useSelector((state:RootState) => state.requisitions)
 
  useEffect(() => { 
    if(selectedRequisition && selectedRequisition.requisition_id){ 
      fetchRequisitionById(selectedRequisition?.requisition_id)
    }

  },[])

  if (!selectedRequisition) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="xl">
        <RequisitionHeader 
          title={selectedRequisition.position!} 
          requisitionId={selectedRequisition.requisition_id} 
        />

        <CoreDetails requisition={selectedRequisition} />

        <JobPostingDetails requisition={selectedRequisition} />

        <Grid spacing={3}>
          <Grid size={{ xs: 12, md: 8, }} >
            <JobDescription requisition={selectedRequisition} />
          </Grid>
        </Grid>

        {/* Bottom Cards Grid */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, md: 4 }} sx={{backgroundColor: 'orange' }}>
             <JobDescriptionHistory />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
             <TotalApplicants requisition={selectedRequisition} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
             <ActivityLog requisition={selectedRequisition} />
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
};

export default RequisitionViewPage;
