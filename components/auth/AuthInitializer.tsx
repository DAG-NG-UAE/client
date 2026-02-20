"use client";

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { fetchUsers } from '@/redux/slices/auth';
import { dispatch } from '@/redux/dispatchHandle';

import { Box, CircularProgress } from '@mui/material';

export const AuthInitializer = ({children}: {children: React.ReactNode}) => { 
  const {isAuthenticated, loading} = useSelector((state: RootState) => state.auth)
  const pathname = usePathname();
  const router = useRouter();

  const isPublicPage = pathname?.startsWith('/careers') || pathname === '/login' || pathname?.startsWith('/salary-proposal');

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


// "use client";

// import { useEffect } from 'react';
// import { usePathname, useRouter } from 'next/navigation';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/redux/store';
// import { fetchUsers } from '@/redux/slices/auth';
// import { Box, CircularProgress } from '@mui/material';

// export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
//   const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);
//   const pathname = usePathname();
//   const router = useRouter();

//   // Define public routes inside the component for clean access
//   const isPublicPage = pathname?.startsWith('/careers') || 
//                        pathname === '/login' || 
//                        pathname?.startsWith('/salary-proposal');

//   // 1. On Mount: Call the backend to see if a session exists
//   useEffect(() => {
//     console.log('mounted')
//     fetchUsers();
//   }, []);

//   // 2. The Watcher: Only redirect when loading is FALSE
//   useEffect(() => {
//     // IMPORTANT: If we are still checking the session (loading is true),
//     // do nothing. Do not redirect. Just wait.
//     if (loading) return;

//     if (!isAuthenticated) {
//       // If the backend check finished and we are NOT logged in
//       if (!isPublicPage) {
//         router.push('/login');
//       }
//     } else {
//       // If we ARE logged in and trying to go to login page, send to dashboard
//       if (pathname === '/login') {
//         router.push('/dashboard');
//       }
//     }
//   }, [isAuthenticated, loading, pathname, isPublicPage, router]);

//   // 3. The Guard: While loading is true, show the spinner. 
//   // This prevents the "children" (your Dashboard) from rendering 
//   // before we know if the user is allowed to see them.
//   if (loading) {
//     return (
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh', 
//         width: '100vw',
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         bgcolor: 'background.default',
//         zIndex: 9999
//       }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   // Once loading is false and isAuthenticated is true, show the app!
//   return <>{children}</>;
// };