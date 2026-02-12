import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import AccessDeniedScreen from './AccessDeniedScreen';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched } = useIsAdmin();

  // Show loading state while checking authentication and admin status
  if (isInitializing || isAdminLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login required
  if (!identity) {
    return <AccessDeniedScreen mode="loginRequired" />;
  }

  // Authenticated but not admin - show not authorized
  if (isFetched && !isAdmin) {
    return <AccessDeniedScreen mode="notAdmin" />;
  }

  // Authenticated and admin - render children (page handles unlock state)
  return <>{children}</>;
}
