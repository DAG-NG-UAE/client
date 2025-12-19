"use client"

import React, { useEffect } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { logoutUser } from '@/redux/slices/auth';
import { RootState } from '@/redux/store';

const drawerWidth = 240;

interface HeaderProps {
  handleDrawerToggle: () => void;
}

const Header = ({ handleDrawerToggle }: HeaderProps) => {
  const theme = useTheme();
  const router = useRouter();
  const {isAuthenticated} = useSelector((state: RootState) => state.auth)

  const handleLogout = () => {
    logoutUser();
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);


  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        // boxShadow: 'none',
        // borderBottom: `1px solid ${theme.palette.divider}`,
        // backgroundColor: theme.palette.background.default,
        // color: theme.palette.text.primary,
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
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
