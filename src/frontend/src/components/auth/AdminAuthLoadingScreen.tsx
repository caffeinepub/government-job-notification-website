import React from 'react';
import { Loader2 } from 'lucide-react';

export default function AdminAuthLoadingScreen() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Verifying Access</h2>
            <p className="text-muted-foreground">
              Please wait while we check your permissions...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
