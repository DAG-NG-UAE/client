"use client";
import React from 'react';
import { Drawer, Box, Typography, Button, IconButton, Select, MenuItem, FormControl, InputLabel, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Requisition } from '@/interface/requisition';

interface RequisitionDrawerProps {
  open: boolean;
  onClose: () => void;
  requisition: Partial<Requisition> | null;
}

const recruiters = ['John Smith', 'Sarah Chen', 'David Lee']; // Mock data

const RequisitionDrawer = ({ open, onClose, requisition }: RequisitionDrawerProps) => {
  if (!requisition) return null;

  const handleApprove = () => {
    console.log('Approved:', requisition.requisition_id);
    onClose();
  };

  const handleReject = () => {
    console.log('Rejected:', requisition.requisition_id);
    onClose();
  };

  const handleAssignRecruiter = (recruiter: string) => {
    console.log(`Assigning ${recruiter} to requisition ${requisition.requisition_id}`);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 600, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Requisition Details</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="subtitle1" fontWeight="bold">{requisition.position}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{requisition.department}</Typography>
        <Typography variant="caption" color="text.secondary">Requested by {requisition.requisition_raised_by} on {new Date(requisition.submitted_date || '').toLocaleDateString()}</Typography>

        <Divider sx={{ my: 3 }} />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="recruiter-select-label">Assign Recruiter</InputLabel>
          <Select
            labelId="recruiter-select-label"
            label="Assign Recruiter"
            defaultValue=""
            onChange={(e) => handleAssignRecruiter(e.target.value)}
          >
            {recruiters.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" color="success" onClick={handleApprove}>Approve</Button>
          <Button variant="outlined" color="error" onClick={handleReject}>On Hold</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default RequisitionDrawer;
