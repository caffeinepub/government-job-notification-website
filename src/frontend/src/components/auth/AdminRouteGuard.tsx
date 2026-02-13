import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsAdmin } from '../../hooks/useIsAdmin';
import AccessDeniedScreen from './AccessDeniedScreen';
import AdminAuthLoadingScreen from './AdminAuthLoadingScreen';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading, isFetched } = useIsAdmin();

  const isAuthenticated = !!identity;

  // Show loading state while Internet Identity is initializing
  if (isInitializing) {
    return <AdminAuthLoadingScreen />;
  }

  // Not authenticated - show login required
  if (!isAuthenticated) {
    return <AccessDeniedScreen mode="loginRequired" />;
  }

  // Authenticated but admin status is still loading - show loading state
  if (isAdminLoading || !isFetched) {
    return <AdminAuthLoadingScreen />;
  }

  // Authenticated and admin check complete - render children if admin
  if (isAdmin) {
    return <>{children}</>;
  }

  // Authenticated but not admin - show access denied
  return <AccessDeniedScreen mode="notAdmin" />;
}
