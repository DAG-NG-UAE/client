"use client"
import React, {useState} from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Header from './Header';
import Sidebar from './Sidebar';
import { customTheme } from '../../theme'; // Import the custom theme

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={customTheme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
          <Header onMenuClick={handleDrawerToggle} />
          <Sidebar open={open} onClose={handleDrawerToggle} />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            {children}
          </Box>
        </Box>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
