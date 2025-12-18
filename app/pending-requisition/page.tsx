"use client";
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchRequisitions, selectRequisitions, selectRequisitionsStatus, setSelectedRequisition, selectSelectedRequisition, clearSelectedRequisition } from '@/store/features/requisitionSlice';
import withAuth from '@/components/auth/withAuth';
import { AppRole } from '@/interface/user';
import { PendingRequisitionColumns } from '@/components/Table/TableColumns';
import TableComponent from '@/components/Table/Table';
import { Requisition } from '@/interface/requisition';
import RequisitionDrawer from '@/components/requisition/RequisitionDrawer';

const PendingRequisitionPage = () => {
  const dispatch = useAppDispatch();
  const requisitions = useAppSelector(selectRequisitions);
  const status = useAppSelector(selectRequisitionsStatus);
  const selectedRequisition = useAppSelector(selectSelectedRequisition);
  
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchRequisitions('pending'));
  }, [dispatch]);

  const handleRowClick = (requisition: Partial<Requisition>) => {
    dispatch(setSelectedRequisition(requisition));
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    dispatch(clearSelectedRequisition());
  };

  const columns = PendingRequisitionColumns;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pending Requisitions
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Review and approve pending requisitions.
      </Typography>
      <TableComponent
        columns={columns}
        data={requisitions}
        loading={status === 'loading' && !drawerOpen}
        onRowClick={handleRowClick}
        keyExtractor={(requisition) => requisition.requisition_id}
      />
      <RequisitionDrawer
        open={drawerOpen}
        onClose={handleDrawerClose}
        requisition={selectedRequisition}
      />
    </Box>
  );
};

export default withAuth(PendingRequisitionPage, [AppRole.HeadOfHr, AppRole.HrManager]);
