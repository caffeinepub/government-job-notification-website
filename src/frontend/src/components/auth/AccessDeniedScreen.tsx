import React from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import LoginButton from './LoginButton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export default function AccessDeniedScreen() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>
            {isAuthenticated ? 'Access Denied' : 'Authentication Required'}
          </AlertTitle>
          <AlertDescription>
            {isAuthenticated
              ? 'You do not have permission to access this page. Only administrators can manage job posts.'
              : 'Please log in to access the admin panel.'}
          </AlertDescription>
        </Alert>
        {!isAuthenticated && (
          <div className="mt-6 flex justify-center">
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}
