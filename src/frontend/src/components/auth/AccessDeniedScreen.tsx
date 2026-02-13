import React from 'react';
import LoginButton from './LoginButton';
import { AlertCircle, ShieldX } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AccessDeniedScreenProps {
  mode?: 'loginRequired' | 'notAdmin';
}

export default function AccessDeniedScreen({ mode = 'notAdmin' }: AccessDeniedScreenProps) {
  const isLoginRequired = mode === 'loginRequired';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Alert variant="destructive">
          {isLoginRequired ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <ShieldX className="h-4 w-4" />
          )}
          <AlertTitle>
            {isLoginRequired ? 'Authentication Required' : 'Access Denied'}
          </AlertTitle>
          <AlertDescription>
            {isLoginRequired
              ? 'Please log in to access the admin panel.'
              : 'You do not have permission to access this page. Only administrators can manage job posts.'}
          </AlertDescription>
        </Alert>
        {isLoginRequired ? (
          <div className="mt-6 flex justify-center">
            <LoginButton />
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            <p className="text-sm text-muted-foreground text-center">
              If you are an administrator, please sign out and sign in again with your admin identity.
            </p>
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
