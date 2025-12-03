import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  Box,
  Button,
} from '@mui/material';
import { getStatusChipProps } from '@/utils/statusColorMapping';
import { EditDocument } from '@mui/icons-material';
import { Requisition } from '@/interface/requisition';




const RequisitionTable = ({requisitions}: {requisitions: Requisition[]}) => {
  return (
    <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
      <Table sx={{ minWidth: 650 }} aria-label="requisition table">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'background.default' }}>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>POSITION</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>DEPARTMENT</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>REQUESTER</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>REQUEST DATE</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>STATUS</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>APPLICANTS</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>PUBLISH</TableCell>
            <TableCell sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem' }}>ACTION</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requisitions.map((row) => (
            <TableRow
              key={row.requisition_id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell>
                <Box>
                  <Typography variant="body2" fontWeight="500">
                    {row.position}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{row.department}</TableCell>
              <TableCell>{row.requisition_raised_by}</TableCell>
              <TableCell sx={{ color: 'text.secondary' }}>{row.submitted_date.split('T')[0]}</TableCell>
              <TableCell>
                <Chip
                  label={row.status}
                  size="small"
                  color={getStatusChipProps(row.status).color}
                  sx={{
                    fontWeight: 500,
                    borderRadius: '6px'
                  }}
                />
              </TableCell>
              <TableCell>{row.applicants}</TableCell>
              <TableCell>
                <Button 
                  variant="outlined"
                  size='small'
                  disabled={row.current_job_description_id == null}
                  sx={{
                    fontWeight: 500,
                    borderRadius: '6px',
                  }}>
                  {row.current_job_description_id == null ? 'Publish' : 'Unpublish'}
                </Button>
              </TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditDocument />}
                  sx={{
                    fontWeight: 500,
                    borderRadius: '6px',
                  }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RequisitionTable;
