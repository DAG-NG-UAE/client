"use client";
import React, { useState, useEffect } from 'react';
import { Box, Typography, Alert, CircularProgress, Pagination, Grid, Card, CardContent, Chip } from '@mui/material';
import { getRequisitions } from '../../api/requisitionApi';
import { useRouter } from 'next/navigation';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import { useTheme } from '@mui/material/styles';

interface Requisition {
  requisition_id: string;
  position: string;
  status: string;
  department: string;
  date_created: string;
  expected_start_date: string; // Changed from expected_date_of_resumption
  applicants: number; // Added for the new UI
}

const RequisitionPage = () => {
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [requisitionsPerPage] = useState(8); // Adjusted for card display
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    const fetchRequisitions = async () => {
      console.log(`inside here the filter status is ${filterStatus}`);
      try {
        setLoading(true);
        setError(null);
        let data: any[];
        if (filterStatus === 'all') {
          data = await getRequisitions();
        } else {
          data = await getRequisitions(filterStatus);
        }

        // Adding dummy applicant data and ensuring expected_start_date for UI consistency
        const requisitionsWithApplicants = data.map(req => ({
          ...req,
          applicants: Math.floor(Math.random() * 50) + 10, // Dummy data
          expected_start_date: req.expected_start_date || new Date().toISOString().split('T')[0], // Ensure date exists
        }));

        setRequisitions(requisitionsWithApplicants);
      } catch (err) {
        setError('Failed to fetch requisitions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequisitions();
  }, [filterStatus]);

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value as string);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRequisitionClick = (requisitionId: string) => {
    router.push(`/candidate-upload?requisitionId=${requisitionId}`);
  };

  const handleStatusChange = async (requisitionId: string, newStatus: string) => {
    console.log(`they want to update the ${requisitionId} to status ${newStatus}`);
    // TODO: Implement actual API call to update requisition status
  };

  // Get current requisitions for pagination
  const indexOfLastRequisition = currentPage * requisitionsPerPage;
  const indexOfFirstRequisition = indexOfLastRequisition - requisitionsPerPage;
  const currentRequisitions = requisitions.slice(indexOfFirstRequisition, indexOfLastRequisition);

  const paginate = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const getStatusChipProps = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return { label: 'Open', color: 'success' as 'success', variant: 'outlined' as 'outlined' };
      case 'in review':
        return { label: 'In Review', color: 'warning' as 'warning', variant: 'outlined' as 'outlined' };
      case 'closed':
        return { label: 'Closed', color: 'error' as 'error', variant: 'outlined' as 'outlined' };
      case 'approved':
        return { label: 'Approved', color: 'success' as 'success', variant: 'outlined' as 'outlined' };
      case 'pending':
        return { label: 'Pending', color: 'error' as 'error', variant: 'outlined' as 'outlined' };
      case 'hold':
        return { label: 'On Hold', color: 'warning' as 'warning', variant: 'outlined' as 'outlined' };
      case 'progress':
        return { label: 'In Progress', color: 'primary' as 'primary', variant: 'outlined' as 'outlined' };
      default:
        return { label: status, color: 'default' as 'default', variant: 'outlined' as 'outlined' };
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Open Requisitions
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
        Manage and track all your hiring requisitions
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="status-filter-label">Status</InputLabel>
          <Select
            labelId="status-filter-label"
            id="status-filter"
            value={filterStatus}
            label="Status"
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="hold">On Hold</MenuItem>
            <MenuItem value="progress">In Progress</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
            <MenuItem value="open">Open</MenuItem> {/* Added 'Open' status */}
            <MenuItem value="in review">In Review</MenuItem> {/* Added 'In Review' status */}
          </Select>
        </FormControl>
        <TextField label="Filter by Department" variant="outlined" />
        <TextField label="Filter by Date" variant="outlined" placeholder="YYYY-MM-DD" />
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', my: 4 }} />}
      {error && <Alert severity="error" sx={{ my: 4 }}>{error}</Alert>}
      {!loading && !error && requisitions.length === 0 && (
        <Typography sx={{ my: 4 }}>No requisitions found.</Typography>
      )}

      {/* @ts-ignore */}
      <Grid container spacing={3}>
  {currentRequisitions?.map((req) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={req.requisition_id}>
      <Card
        sx={{
          // 👇 Set a fixed, explicit height for the card
          height: 220, 
          width: 200,
          // Removed minHeight and relied on fixed height
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
          '&:hover': { boxShadow: theme.shadows[3] },
        }}
        onClick={() => handleRequisitionClick(req.requisition_id)}
      >
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box sx={{
              backgroundColor: theme.palette.icons?.container, 
              borderRadius: (theme.shape.borderRadius as number) / 2, 
              height: '40px',
              width: '40px',
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center'
            }}>
              <WorkIcon sx={{ fontSize: 24, color: theme.palette.icons?.main }} />
            </Box>
            <Chip {...getStatusChipProps(req.status)} size="small" />
          </Box>
          {/* 👇 Apply CSS for Truncation/Overflow */}
          <Typography 
            variant="body1" 
            component="div" 
            sx={{ 
              mb: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 1, // Set to 1 to force single line
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            {req.position}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 1, // Set to 1 to force single line
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            {req.department}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mt: 2 }}>
            <GroupIcon sx={{ mr: 0.5, fontSize: 18 }} />
            <Typography variant="body2">{req.applicants} applicants</Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(requisitions.length / requisitionsPerPage)}
          page={currentPage}
          onChange={paginate}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default RequisitionPage;
