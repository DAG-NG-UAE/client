"use client"

import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SummaryStats from '../../components/requisition/SummaryStats';
import RequisitionFilters from '../../components/requisition/RequisitionFilters';
import RequisitionTable from '../../components/requisition/RequisitionTable';
import { getRequisitions } from '@/api/requisitionApi';
import { Requisition } from '@/interface/requisition';
import { useState } from 'react';

const RequisitionPage = () => {
  const [requisitions, setRequisitions] = useState<any[]>([]);

  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        const requisitions = await getRequisitions();
        console.log('Fetched requisitions:', requisitions);
        setRequisitions(requisitions);
      } catch (error) {
        console.error('Error fetching requisitions:', error);
      }
    };
    fetchRequisitions();
  }, []);
  return (
    <Box sx={{ p: 3, minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="600" gutterBottom>
              Requisition Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Review and manage hiring requests from department heads
            </Typography>
          </Box>
        </Stack>

        {/* Summary Stats */}
        <SummaryStats />

        {/* Filters */}
        <RequisitionFilters />

        {/* Table */}
        <RequisitionTable requisitions={requisitions}/>
      </Container>
    </Box>
  );
};

export default RequisitionPage;