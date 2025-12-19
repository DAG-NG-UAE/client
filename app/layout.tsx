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
import { usePathname } from 'next/navigation';
import {AuthInitializer} from '../components/auth/AuthInitializer'
import { Provider as ReduxProvider } from 'react-redux';
import {store, persistor} from '../redux/store'
import { PersistGate } from 'redux-persist/integration/react';

const inter = Inter({ subsets: ["latin"] });

const drawerWidth = 240;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const theme = getAppTheme(isDarkMode ? 'dark' : 'light');

  const isLoginPage = pathname === '/login';
  const isPublicPage = pathname?.startsWith('/careers');

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                {isLoginPage || isPublicPage ? (
                  // Public layout
                  <Box sx={{
                    backgroundColor: isLoginPage ? theme.palette.loginBackground : theme.palette.background.default,
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: isLoginPage ? 'center' : 'flex-start',
                    alignItems: isLoginPage ? 'center' : 'stretch',
                  }}>
                    {children}
                  </Box>
                ) : (
                  // Private layout
                  <AuthInitializer>
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
                  </AuthInitializer>
                )}
              </ThemeProvider>
              </PersistGate>
          </ReduxProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
