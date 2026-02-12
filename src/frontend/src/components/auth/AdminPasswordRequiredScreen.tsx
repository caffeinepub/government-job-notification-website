import { useEffect, useState } from 'react';
import AdminPasswordGateModal from './AdminPasswordGateModal';

export default function AdminPasswordRequiredScreen() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Auto-open modal on mount
  useEffect(() => {
    setShowPasswordModal(true);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <AdminPasswordGateModal
        open={showPasswordModal}
        onOpenChange={setShowPasswordModal}
      />
    </div>
  );
}
