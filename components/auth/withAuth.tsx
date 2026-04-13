"use client";
import { RootState } from '@/redux/store';
import { AppRole } from '@/utils/constants';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// Maps each role to the first page they are allowed to land on
const ROLE_HOME: Record<string, string> = {
  [AppRole.Admin]:           '/dashboard',
  [AppRole.HeadOfHr]:        '/dashboard',
  [AppRole.HrManager]:       '/dashboard',
  [AppRole.Recruiter]:       '/requisition',
  [AppRole.HiringManager]:   '/requisition',
  [AppRole.HR]:              '/requisition',
  [AppRole.StandardEmployee]: '/requisition',
};

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
        const home = ROLE_HOME[user.role_name] ?? '/requisition';
        router.push(home);
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
