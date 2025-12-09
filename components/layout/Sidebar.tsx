import React from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoricalIcon from '@mui/icons-material/History';
import { styled, useTheme } from '@mui/material/styles';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const Sidebar = ({ mobileOpen, handleDrawerToggle }: SidebarProps) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' }, // Changed path to /dashboard
    { text: 'Requisitions', icon: <DescriptionIcon />, path: '/requisition' },
    { text: 'Candidates', icon: <PeopleIcon />, path: '/candidates' },
    // { text: 'Interviews', icon: <EventNoteIcon />, path: '/interviews' },
    // { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
    { text: 'Historical Data', icon:<HistoricalIcon/>, path: '/history'},
    // { text: 'Departments', icon: <BusinessIcon />, path: '/departments' },
    // { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawerContent = (
    <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{
        padding: theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '64px',
        backgroundColor: theme.palette.mode === 'light' ? '#030213' : theme.palette.background.default,
        color: theme.palette.mode === 'light' ? 'oklch(0.985 0 0)' : theme.palette.text.primary,
      }}>
        <Typography variant="h6" noWrap component="div">
          HR Portal
        </Typography>
      </Box>
      <List sx={{ flexGrow: 1, paddingTop: theme.spacing(1) }}>
        {menuItems.map((item) => (
          <ListItemButton 
            key={item.text} 
            selected={pathname === item.path} // Set selected based on current path
            onClick={() => {
              router.push(item.path); 
              handleDrawerToggle(); // Close drawer on mobile after navigation
            }}
            sx={{
            margin: theme.spacing(0.5, 1),
            borderRadius: theme.shape.borderRadius,
            '&.Mui-selected': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': {
                backgroundColor: theme.palette.primary.main,
              },
            },
            '&:hover': {
              backgroundColor: theme.palette.action.hover,
            },
          }}>
            <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{
        padding: theme.spacing(2),
        borderTop: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1),
      }}>
        <Box sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: theme.palette.primary.main,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme.palette.primary.contrastText,
          fontWeight: theme.typography.fontWeightMedium,
        }}>
          JD
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: theme.typography.fontWeightMedium }}>John Doe</Typography>
          <Typography variant="body2" color="text.secondary">HR Manager</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile drawer */}
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
        {drawerContent}
      </Drawer>
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
