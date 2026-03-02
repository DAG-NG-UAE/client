"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { fetchUsers } from '@/redux/slices/auth';
import { dispatch } from '@/redux/dispatchHandle';

import { Box, CircularProgress } from '@mui/material';

export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
  const pathname = usePathname();
  const router = useRouter();

  const cleanPathname = (pathname?.toLowerCase() || '/').replace(/\/$/, '') || '/';
  const isPublicPage = cleanPathname === '/' || cleanPathname.startsWith('/careers') || cleanPathname === '/login' || cleanPathname.startsWith('/salary-proposal');

  useEffect(() => {
    console.log(`AuthInitializer: Initial Check - isAuthenticated=${isAuthenticated}, loading=${loading}, pathname=${pathname}`);

    // Always attempt to fetch user info on mount to ensure session sync
    // This is critical when coming back from an SSO redirect
    fetchUsers();
  }, []);

  useEffect(() => {
    // Wait until loading is finished
    if (loading) return;

    console.log(`AuthInitializer: State Update - isAuthenticated=${isAuthenticated}, loading=${loading}`);

    if (!isAuthenticated) {
      if (!isPublicPage) {
        console.log('AuthInitializer: Redirecting to login (Not authenticated)');
        router.push('/login');
      }
    } else {
      if (pathname === '/login') {
        console.log('AuthInitializer: Redirecting to dashboard (Already authenticated)');
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, loading, pathname, isPublicPage]);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        bgcolor: 'background.default',
        zIndex: 9999
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}