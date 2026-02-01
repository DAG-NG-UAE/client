"use client"
import React, { useState, useEffect } from 'react';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Collapse } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import PeopleIcon from '@mui/icons-material/People';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import BusinessIcon from '@mui/icons-material/Business';
import SettingsIcon from '@mui/icons-material/Settings';
import HistoricalIcon from '@mui/icons-material/History';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning'
import GestureIcon from '@mui/icons-material/Gesture';
import WorkIcon from '@mui/icons-material/Work';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { styled, useTheme } from '@mui/material/styles';
import { useRouter, usePathname } from 'next/navigation'; // Import useRouter and usePathname
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { AppRole } from '@/utils/constants';
import { formatRoleName } from '@/utils/transform';

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  desktopOpen?: boolean;
}

const Sidebar = ({ mobileOpen, handleDrawerToggle, desktopOpen = true }: SidebarProps) => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const [isRecruitmentOpen, setRecruitmentOpen] = useState(false);
  const [isCandidatesOpen, setCandidatesOpen] = useState(false);
  const [isOfferOpen, setOfferOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  console.log(`the user is => ${JSON.stringify(user)} and isAuthenticated is => ${isAuthenticated}`)

  useEffect(() => {
    if (pathname.startsWith('/candidates')) {
      setCandidatesOpen(true);
    }
  }, [pathname]);

  const handleCandidatesClick = () => {
    setCandidatesOpen(!isCandidatesOpen);
  };

  const handleRecruitmentClick = () => {
    setRecruitmentOpen(!isRecruitmentOpen);
  };

  const handleOfferClick = () => {
    setOfferOpen(!isOfferOpen);
  };

  const allMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: [AppRole.Admin, AppRole.HeadOfHr, AppRole.HrManager, AppRole.Recruiter] },
    // { text: 'Historical Data', icon:<HistoricalIcon/>, path: '/history', roles: [AppRole.Admin, AppRole.HeadOfHr, AppRole.HrManager] },
    { text: 'Signatures', icon: <GestureIcon />, path: '/signatures', roles: [AppRole.Admin, AppRole.HeadOfHr, AppRole.HrManager] },
  ];

  const menuItems = allMenuItems.filter(item => user && item.roles.includes(user.role_name));

  const recruitmentSubItems = [ 
    { text: 'New Request', icon: <NoteAddIcon/> , path:'/requisition/request', roles: [AppRole.Admin, AppRole.HeadOfHr, AppRole.HrManager, AppRole.HiringManager, AppRole.Recruiter]},
    { text: 'Pending Requisitions', icon: <PendingActionsIcon/> , path:'/pending-requisition', roles: [AppRole.HeadOfHr, AppRole.HrManager]},
    { text: 'Requisitions', icon: <DescriptionIcon />, path: '/requisition', roles: [AppRole.Admin, AppRole.HeadOfHr, AppRole.HrManager, AppRole.HiringManager, AppRole.Recruiter] },
  ]

  const recruitmentMenuItems = recruitmentSubItems.filter(item => user && item.roles.includes(user.role_name));
  const candidateSubItems = [
    { text: 'All', path: '/candidates/all', icon: <ListAltIcon />},
    { text: 'Applied', path: '/candidates/applied', icon: <PersonAddIcon /> },
    { text: 'Shortlisted', path: '/candidates/shortlisted', icon: <FactCheckIcon /> },
    { text: 'Interview Scheduled', path: '/candidates/interview_scheduled', icon: <CalendarMonthIcon /> },
    { text: 'Pending Feedback', path: '/candidates/pending_feedback', icon: <HourglassEmptyIcon /> },
    { text: 'Interviewed', path: '/candidates/interviewed', icon: <QuestionAnswerIcon /> },
    { text: 'Internal Approval', path: '/candidates/internal_salary_proposal', icon: <HowToRegIcon /> },
    { text: 'Approved for Offer', path: '/candidates/approved_for_offer', icon: <HowToRegIcon /> },
    { text: 'Rejected', path: '/candidates/rejected', icon: <PersonOffIcon /> },
  ];

  if (user && (user.role_name === AppRole.HeadOfHr || user.role_name === AppRole.HrManager)) {
    candidateSubItems.splice(6, 0, { text: 'Pre Offer', path: '/candidates/pre_offer', icon: <AssignmentIcon /> });
  }

  const offerSubItems = [
    { text: 'All', path: '/offers/all', icon: <ListAltIcon /> },
    { text: 'Pending', path: '/offers/pending', icon: <HourglassEmptyIcon /> },
    { text: 'Accepted', path: '/offers/accepted', icon: <CheckCircleIcon /> },
    { text: 'Rejected', path: '/offers/rejected', icon: <CancelIcon /> },
    { text: 'Revision Requested', path: '/offers/revision_requested', icon: <EditNoteIcon /> },
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
              if (mobileOpen) handleDrawerToggle(); // Close drawer on mobile after navigation
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
        {/* Recruitment collapsible menu */}
        <ListItemButton 
          onClick={handleRecruitmentClick}
          selected={pathname.startsWith('/recruitment')}
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
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><WorkIcon/> </ListItemIcon>
          <ListItemText primary="Recruitment" />
          {isRecruitmentOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isRecruitmentOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {recruitmentMenuItems.map((item) => (
              <ListItemButton
                key={item.text}
                selected={pathname === item.path}
                onClick={() => {
                  router.push(item.path);
                  if (mobileOpen) handleDrawerToggle(); // Close drawer on mobile
                }}
                sx={{ 
                  pl: 4,
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
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
        {/* Candidates collapsible menu */}
        <ListItemButton 
          onClick={handleCandidatesClick}
          selected={pathname.startsWith('/candidates')}
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
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Candidates" />
          {isCandidatesOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isCandidatesOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {candidateSubItems.map((item) => (
              <ListItemButton
                key={item.text}
                selected={pathname === item.path}
                onClick={() => {
                  router.push(item.path);
                  if (mobileOpen) handleDrawerToggle(); // Close drawer on mobile
                }}
                sx={{ 
                  pl: 4,
                  margin: theme.spacing(0.5, 1),
                  borderRadius: theme.shape.borderRadius,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* Offer dropdown */}
        <ListItemButton 
          onClick={handleOfferClick}
          selected={pathname.startsWith('/offer')}
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
          }}
        >
          <ListItemIcon sx={{ color: 'inherit' }}><LocalOfferIcon /></ListItemIcon>
          <ListItemText primary="Offers" />
          {isOfferOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={isOfferOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {offerSubItems.map((item) => (
              <ListItemButton
                key={item.text}
                selected={pathname === item.path}
                onClick={() => {
                  router.push(item.path);
                  if (mobileOpen) handleDrawerToggle(); // Close drawer on mobile
                }}
                sx={{ 
                  pl: 4,
                  margin: theme.spacing(0.5, 1),
                  borderRadius: theme.shape.borderRadius,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

      </List>
      {user && (
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
            {/* {user.full_name.charAt(0).toUpperCase()} */}kk
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: theme.typography.fontWeightMedium }}>{user.full_name}</Typography>
            <Typography variant="body2" color="text.secondary">{formatRoleName(user.role_name)}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: desktopOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 }, transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      })
      }}
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
        variant="persistent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open={desktopOpen}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
