"use client"

import React, { useEffect, useState } from 'react';
import { Box, Container, Button, Stack, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import RequisitionHeader from '@/components/requisition/RequisitionHeader';
import CoreDetails from '@/components/requisition/CoreDetails';
import JobPostingDetails from '@/components/requisition/JobPostingDetails';
import JobDescription from '@/components/requisition/JobDescription';
import { Requisition } from '@/interface/requisition';
import { Save } from '@mui/icons-material';
import { getSingleRequisition, updateRequisition } from '@/api/requisitionApi';
import {  useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { callUnPublishRequisition, fetchRequisitions, callPublishRequisition, fetchRequisitionById } from '@/redux/slices/requisition';
import { dispatch } from '@/redux/dispatchHandle';
import { enqueueSnackbar } from 'notistack';



const RequisitionEditPage = () => {
  const {loading, selectedRequisition} = useSelector((state:RootState) => state.requisitions)
 
  useEffect(() => { 
    if(selectedRequisition && selectedRequisition.requisition_id){ 
      fetchRequisitionById(selectedRequisition?.requisition_id)
    }

  },[])

  if (!selectedRequisition) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }
  const params = useParams();
  const router = useRouter();
  const [jobDescriptionMarkdown, setJobDescriptionMarkdown] = useState<string>('');


  const handleSave = async () => {
    console.log('Saving markdown...', jobDescriptionMarkdown);
    
    // Update requisition with markdown
    const updatedRequisition = {
      ...selectedRequisition,
      job_description: jobDescriptionMarkdown,
    };
    console.log('Saving requisition...', updatedRequisition);
    // router.push(`/requisition/${params.id}`);
    await updateRequisition(params.id as string, updatedRequisition);
    console.log('Requisition saved successfully');
    router.push(`/requisition/${params.id}`);
  };

  const handlePublishRequisition = async(requisitionId: string) => { 
    await callPublishRequisition(requisitionId);
    await fetchRequisitions()
  }

  const handleUnpublishRequisition = async(requisitionId:string, jobListKey: string) => { 
    console.log('clicked on the unpublish')
    await callUnPublishRequisition(requisitionId, jobListKey)
    
    // since this is the edit page, what we want to do is set the selected requisition again cos they are not going back to the requisition table after publishing or unpublish a requisition 
    await fetchRequisitions()
  }

  if (!selectedRequisition) {
    return <Box sx={{ p: 3 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="xl">
        <RequisitionHeader 
          title="Edit Requisition" 
          requisitionId={selectedRequisition.requisition_id} 
          isEditMode 
        />
        <CoreDetails requisition={selectedRequisition} />

        <JobPostingDetails 
          requisition={selectedRequisition} 
          isEditMode 
          handlePublishRequisition={handlePublishRequisition}
          handleUnpublishRequisition={handleUnpublishRequisition}
        />

        <JobDescription 
          requisition={selectedRequisition} 
          isEditMode 
          onContentChange={setJobDescriptionMarkdown}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button 
                variant="contained" 
                startIcon={<Save />}
                onClick={handleSave}
                size="large"
            >
                Save Job Description
            </Button>
        </Box>

      </Container>
    </Box>
  );
};

export default RequisitionEditPage;
