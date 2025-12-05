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



const RequisitionEditPage = () => {
  const params = useParams();
  const router = useRouter();
  const [requisition, setRequisition] = useState<Partial<Requisition>>({});
  const [jobDescriptionMarkdown, setJobDescriptionMarkdown] = useState<string>('');

  useEffect(() => {
    const fetchSingleRequisition = async () => {
      try {
        const response = await getSingleRequisition(params.id as string);
        setRequisition(response);
      } catch (error) {
        console.error('Error fetching requisition:', error);
      }
    };
    fetchSingleRequisition();
  }, [params.id]);

  const handleSave = async () => {
    console.log('Saving markdown...', jobDescriptionMarkdown);
    
    // Update requisition with markdown
    const updatedRequisition = {
      ...requisition,
      job_description: jobDescriptionMarkdown,
    };
    console.log('Saving requisition...', updatedRequisition);
    // router.push(`/requisition/${params.id}`);
    await updateRequisition(params.id as string, updatedRequisition);
    console.log('Requisition saved successfully');
    router.push(`/requisition/${params.id}`);
  };

  if (!requisition) {
    return <Box sx={{ p: 3 }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="xl">
        <RequisitionHeader 
          title="Edit Requisition" 
          requisitionId={requisition.requisition_id} 
          isEditMode 
        />
        <CoreDetails requisition={requisition} />

        <JobPostingDetails requisition={requisition} isEditMode />

        <JobDescription 
          requisition={requisition} 
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
