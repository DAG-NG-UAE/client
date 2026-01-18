"use client"

import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Stack } from '@mui/material';
import SummaryStats from '../../components/SummaryStats';
import Filters from '../../components/Filters';
import withAuth from '@/components/auth/withAuth';
import { AppRole } from '@/utils/constants';
import { fetchRequisitions, setSelectedRequisition } from '@/redux/slices/requisition';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import TableComponent from '@/components/Table/Table';
import { RequisitionColumns } from '@/components/Table/TableColumns';
import { Requisition } from '@/interface/requisition';
import { dispatch } from '@/redux/dispatchHandle';
import { RequisitionRowActions } from '@/components/requisition/RequisitionAction';


const RequisitionPage = () => {
  const {requisitions, loading, meta} = useSelector((state:RootState) => state.requisitions)
 
  console.log(`the requisitions are => ${JSON.stringify(requisitions)}`)
  const columns = RequisitionColumns
  const status = loading

  const handleRowClick = (requisition: Partial<Requisition>) => {
    console.log(`the requisition clicked on => ${JSON.stringify(requisition)}`)
    dispatch(setSelectedRequisition(requisition));
  };
 
  const menuItems = [
    { text: 'All', value: 'all' },
    { text: 'Pending', value: 'pending' },
    { text: 'Approved', value: 'approved' },
    { text: 'Rejected', value: 'rejected' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      await fetchRequisitions();
    };
    fetchData();
  }, []);
  
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
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
        {/* <SummaryStats stats={[
            { title: 'Total Requisitions', value: 'X' },
            { title: 'Pending Review', value: 'X' },
            { title: 'Approved', value: 'X' },
            { title: 'In Progress', value: 'X' },
          ]}/> */}

        {/* Filters */}
        <Filters 
        menuItems={menuItems} 
        textPlaceholder="Search by position, department, or requester..." 
        isCandidate={false} 
        />

        {/* Table component */}
        <TableComponent
          columns={columns}
          data={requisitions}
          actions={(requisition) => <RequisitionRowActions requisition={requisition} />}
          loading={status == true}
          onRowClick={handleRowClick}
          keyExtractor={(requisitions) => requisitions.requisition_id}
          totalCount={meta?.total || 0}
          page={(meta?.page || 1) - 1}
          rowsPerPage={meta?.limit || 10}
          onPageChange={(e, newPage) => fetchRequisitions(undefined, newPage + 1, meta?.limit)}
          onRowsPerPageChange={(e) => fetchRequisitions(undefined, 1, parseInt(e.target.value, 10))}
        >
        </TableComponent>
      </Container>
    </Box>
  );
};

export default withAuth(RequisitionPage, ['admin', 'hiring_manager', AppRole.HeadOfHr, AppRole.Recruiter]);