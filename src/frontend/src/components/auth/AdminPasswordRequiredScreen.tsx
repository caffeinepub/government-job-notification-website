import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';
import { Lock, ShieldAlert } from 'lucide-react';
import AdminPasswordGateModal from './AdminPasswordGateModal';

export default function AdminPasswordRequiredScreen() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Alert className="border-destructive/50 bg-destructive/10">
          <ShieldAlert className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-lg font-semibold">
            Admin Access Locked
          </AlertTitle>
          <AlertDescription className="mt-2 space-y-4">
            <p className="text-sm">
              This area requires admin password authentication. Please unlock to
              continue.
            </p>
            <Button
              onClick={() => setShowPasswordModal(true)}
              className="w-full"
              size="lg"
            >
              <Lock className="w-4 h-4 mr-2" />
              Unlock Admin Panel
            </Button>
          </AlertDescription>
        </Alert>
      </div>

      <AdminPasswordGateModal
        open={showPasswordModal}
        onOpenChange={setShowPasswordModal}
      />
    </div>
  );
}
