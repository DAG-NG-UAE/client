"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { getAppTheme } from '../theme';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { Box, Toolbar } from '@mui/material';
import React, { useState } from 'react';

const inter = Inter({ subsets: ["latin"] });

const drawerWidth = 240;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = getAppTheme(isDarkMode ? 'dark' : 'light');

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
              <Header handleDrawerToggle={handleDrawerToggle} />
              <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  p: 3,
                  width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
              >
                <Toolbar /> {/* This is important for content to not be hidden by AppBar */}
                {children}
              </Box>
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
