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
        {/* <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, md: 4 }} sx={{backgroundColor: 'orange' }}>
             <JobDescriptionHistory />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
             <TotalApplicants requisition={selectedRequisition} />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
             <ActivityLog requisition={selectedRequisition} />
          </Grid>
        </Grid> */}

      </Container>
    </Box>
  );
};

export default RequisitionViewPage;
