import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useClientAdminAuth } from '../../hooks/useClientAdminAuth';
import { Button } from '../ui/button';
import { clearSessionParameter } from '../../utils/urlParams';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { logout: logoutAdmin } = useClientAdminAuth();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';
  const text = loginStatus === 'logging-in' ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      // Clear admin token from sessionStorage on logout
      clearSessionParameter('caffeineAdminToken');
      // Clear admin unlock state
      logoutAdmin();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      variant={isAuthenticated ? 'outline' : 'default'}
    >
      {text}
    </Button>
  );
}
