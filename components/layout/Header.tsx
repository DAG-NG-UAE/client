"use client"

import React, { useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { logoutUser } from '@/redux/slices/auth';
import { RootState } from '@/redux/store';
import SystemManual from '../manual/SystemManual';
import BookIcon from '@mui/icons-material/MenuBook';

const drawerWidth = 240;

interface HeaderProps {
  handleDrawerToggle: () => void;
  desktopOpen?: boolean;
  handleDesktopToggle?: () => void;
}

const Header = ({ handleDrawerToggle, desktopOpen = true, handleDesktopToggle }: HeaderProps) => {
  const theme = useTheme();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    logoutUser();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);


  const isMobile = theme.breakpoints.down('sm');

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: desktopOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
        ml: { sm: desktopOpen ? `${drawerWidth}px` : 0 },
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
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
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDesktopToggle}
          sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
        >
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          color="inherit"
          startIcon={<BookIcon />}
          onClick={() => router.push('/how-to-use')}
          sx={{ mr: 2, textTransform: 'none', fontWeight: 600 }}
        >
          How to Use
        </Button>
        <SystemManual />
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
