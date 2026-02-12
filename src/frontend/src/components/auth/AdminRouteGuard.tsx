import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import { useClientAdminAuth } from '../../hooks/useClientAdminAuth';
import AccessDeniedScreen from './AccessDeniedScreen';
import AdminPasswordRequiredScreen from './AdminPasswordRequiredScreen';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched } = useIsAdmin();
  const { isUnlocked } = useClientAdminAuth();

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

  // Authenticated and admin, but client-side unlock not satisfied
  if (!isUnlocked) {
    return <AdminPasswordRequiredScreen />;
  }

  // Authenticated, admin, and unlocked
  return <>{children}</>;
}
