"use client";
import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemText, CssBaseline, Button, Alert, CircularProgress, ListItemButton, Pagination } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { getRequisitions } from '../../api/requisitionApi';
import { useRouter } from 'next/navigation';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
// import { updateRequisition } from '../../api/requisitionApi';

const drawerWidth = 240;

interface Requisition {
  requisition_id: string;
  position: string;
  status: string;
  department: string;
  date_created: string;
  expected_date_of_resumption: string;
  // Add other requisition fields as they exist in your backend
}

const RequisitionPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [requisitionsPerPage] = useState(5); // You can adjust this value
  const router = useRouter();

  useEffect(() => {
    const fetchRequisitions = async () => {
      console.log(`inside here the filter status is ${filterStatus}`)
      try {
        setLoading(true);
        setError(null);
        let data 
        if(filterStatus == 'all'){ 
          data = await getRequisitions()
        }else{ 
          data = await getRequisitions(filterStatus);
        }
        setRequisitions(data);
      } catch (err) {
        setError('Failed to fetch requisitions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequisitions();
  }, [filterStatus]); // Re-run effect when filterStatus changes

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterStatus(event.target.value as string);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleRequisitionClick = (requisitionId: string) => {
    router.push(`/candidate-upload?requisitionId=${requisitionId}`);
  };

  // const handleStatusChange = async (requisitionId: string, newStatus: string) => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     await updateRequisition(requisitionId, { status: newStatus });
  //     // Re-fetch requisitions to update the list after status change
  //     const data = await getRequisitions();
  //     setRequisitions(data);
  //   } catch (err) {
  //     setError('Failed to update requisition status.');
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleStatusChange = async (requisitionId: string, newStatus: string) => {
    console.log(`they want to update th ${requisitionId} to status ${newStatus}`) 

  }

  // Get current requisitions for pagination
  const indexOfLastRequisition = currentPage * requisitionsPerPage;
  const indexOfFirstRequisition = indexOfLastRequisition - requisitionsPerPage;
  const currentRequisitions = requisitions.slice(indexOfFirstRequisition, indexOfLastRequisition);

  // Change page
  const paginate = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        HR Portal
      </Typography>
      <List>
        <ListItemButton>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Requisitions" />
        </ListItemButton>
        <ListItemButton>
          <ListItemText primary="Candidates" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            HR Requisition Portal
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of the drawer. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {/* <Toolbar /> Placeholder for the AppBar */}
        <Typography variant="h4" gutterBottom>
          Active Requisitions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
            </Select>
          </FormControl>
          <TextField label="Filter by Department" variant="outlined" />
          <TextField label="Filter by Date" variant="outlined" placeholder="YYYY-MM-DD" />
        </Box>

        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && requisitions.length === 0 && (
          <Typography>No requisitions</Typography>
        )}
        <List>
          {currentRequisitions?.map((req) => (
            <ListItemButton key={req.requisition_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
              <Box onClick={() => handleRequisitionClick(req.requisition_id)} sx={{ flexGrow: 1, p: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{req.position}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: {req.status} | Expected Resumption: {new Date(req.expected_start_date).toLocaleDateString()}
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">Department: {req.department}</Typography> */}
              </Box>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2 }} onClick={(e) => e.stopPropagation()}> {/* Stop propagation here */}
                <InputLabel id={`status-label-${req.requisition_id}`}>Status</InputLabel>
                <Select
                  labelId={`status-label-${req.requisition_id}`}
                  value={req.status}
                  onChange={(e: SelectChangeEvent) => handleStatusChange(req.requisition_id, e.target.value as string)}
                  label="Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </ListItemButton>
          ))}
        </List>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(requisitions.length / requisitionsPerPage)}
            page={currentPage}
            onChange={paginate}
            color="primary"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RequisitionPage;
