"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchUser } from '@/store/features/authSlice';
import { usePathname, useRouter } from 'next/navigation';

export const AuthInitializer = ({children}: {children: React.ReactNode}) => { 
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPage = pathname?.startsWith('/careers') || pathname === '/login';

  useEffect(() => {
    // Only fetch the user if it's not a public page and we haven't authenticated yet.
    if (!isPublicPage && !isAuthenticated) {
      dispatch(fetchUser());
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
