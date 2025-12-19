"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { fetchUsers } from '@/redux/slices/auth';
import { dispatch } from '@/redux/dispatchHandle';

export const AuthInitializer = ({children}: {children: React.ReactNode}) => { 
  const {isAuthenticated, loading} = useSelector((state: RootState) => state.auth)
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPage = pathname?.startsWith('/careers') || pathname === '/login';

  useEffect(() => {
    // Only fetch the user if it's not a public page and we haven't authenticated yet.
    if (!isPublicPage && !isAuthenticated) {
      fetchUsers()
    }
  }, [dispatch, isAuthenticated, isPublicPage]);

  useEffect(() => {
    // Wait until the loading is false before we do any redirect
    if (loading || isPublicPage) return; 

    // If not authenticated and not on a public page, redirect to login.
    if (!isAuthenticated) {
      console.log('from inside here you are not authenticated')
      router.push('/login');
    }
  }, [isAuthenticated, loading, pathname, router, isPublicPage]);

  // For authenticated users trying to access login, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      console.log('you are the reason I cannot go')
      router.push(pathname);
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
