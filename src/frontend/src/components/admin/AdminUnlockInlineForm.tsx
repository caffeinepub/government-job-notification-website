import { useState, FormEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Lock } from 'lucide-react';

const CORRECT_PASSWORD = '@ni#ra&j*gurja:r';

export default function AdminUnlockInlineForm() {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    // Direct password check
    if (password === CORRECT_PASSWORD) {
      // Set localStorage
      localStorage.setItem('isAdmin', 'true');
      
      // Direct DOM manipulation - hide login, show dashboard
      const loginContainer = document.getElementById('login-form-container');
      const dashboardContainer = document.getElementById('admin-dashboard-grid');
      
      if (loginContainer) {
        loginContainer.style.display = 'none';
      }
      if (dashboardContainer) {
        dashboardContainer.style.display = 'block';
      }
      
      // Show welcome alert
      alert('Welcome Back, Niraj! ✅');
      
      setPassword('');
    } else {
      // Wrong password - do nothing, don't set isAdmin
      setPassword('');
    }
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Enter the admin password to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  autoComplete="off"
                  autoFocus
                  className="text-base"
                />
              </div>
              <Button
                type="submit"
                disabled={!password.trim()}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg"
              >
                Unlock Dashboard
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Stuck? Click to Reset
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
