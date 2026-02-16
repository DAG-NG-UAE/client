"use client";
import { RootState } from '@/redux/store';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles?: string[]
) => {
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push('/login');
      } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role_name)) {
        router.push('/unauthorized'); // Or some other page
      }
    }, [isAuthenticated, user, loading, router]);

    if (loading || !isAuthenticated) {
      console.log(`I am trying to move to the next item but the loading is true or the user is not authenticated`)
      // You can return a loading spinner here
      return null;
    }

    if (user && allowedRoles && !allowedRoles.includes(user.role_name)) {
      console.log(`I want to move to the next page`)
        return null; // Or a message
    }

    return <WrappedComponent {...props} />;
  };

  return AuthComponent;
};

export default withAuth;
