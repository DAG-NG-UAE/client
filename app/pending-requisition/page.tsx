"use client";
import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import withAuth from '@/components/auth/withAuth';
import { PendingRequisitionColumns } from '@/components/Table/TableColumns';
import TableComponent from '@/components/Table/Table';
import { Requisition } from '@/interface/requisition';
import RequisitionDrawer from '@/components/requisition/RequisitionDrawer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { clearSelectedRequisition, fetchRequisitions, setSelectedRequisition } from '@/redux/slices/requisition';
import { dispatch } from '@/redux/dispatchHandle';
import { AppRole } from '@/utils/constants';

const PendingRequisitionPage = () => {
  const {requisitions, selectedRequisition, loading, error} = useSelector((state: RootState) => state.requisitions)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const status = loading

  useEffect(() => {
    fetchRequisitions('pending')
    
  }, [drawerOpen]);

  const handleRowClick = (requisition: Partial<Requisition>) => {
    console.log(`the requisition clicked on => ${JSON.stringify(requisition)}`)
    dispatch(setSelectedRequisition(requisition));
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    clearSelectedRequisition();
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
        loading={status == true && !drawerOpen}
        error={error}
        onRetry={() => fetchRequisitions('pending')}
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
