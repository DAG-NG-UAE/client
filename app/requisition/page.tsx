"use client";
import React, { useState, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemText, CssBaseline, Button, Alert, CircularProgress, ListItemButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { getRequisitions } from '../../api/requisitionApi';
import { useRouter } from 'next/navigation';

const drawerWidth = 240;

// interface Requisition {
//   id: string;
//   title: string;
//   status: string;
//   // Add other requisition fields as they exist in your backend
// }

const RequisitionPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRequisitions = async () => {
      try {
        setLoading(true);
        const data = await getRequisitions();
        setRequisitions(data);
      } catch (err) {
        setError('Failed to fetch requisitions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequisitions();
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleRequisitionClick = (requisitionId: string) => {
    router.push(`/candidate-upload?requisitionId=${requisitionId}`);
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
        <Toolbar /> {/* Spacer for the AppBar */}
        <Typography variant="h4" gutterBottom>
          Active Requisitions
        </Typography>
        {loading && <CircularProgress />}
        {error && <Alert severity="error">{error}</Alert>}
        {!loading && !error && requisitions.length === 0 && (
          <Typography>No requisitions found.</Typography>
        )}
        <List>
          {requisitions?.map((req) => (
            <ListItemButton key={req.requisition_id} onClick={() => handleRequisitionClick(req.requisition_id)}>
              <ListItemText primary={req.position} secondary={`Status: ${req.status}`} />
            </ListItemButton>
          ))}
        </List>
        {/* Placeholder for fetching different statuses */}
        <Box sx={{ mt: 4 }}>
          <Button variant="outlined" sx={{ mr: 2 }} onClick={() => console.log('Fetch Pending')}>Fetch Pending</Button>
          <Button variant="outlined" onClick={() => console.log('Fetch Approved')}>Fetch Approved</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default RequisitionPage;
