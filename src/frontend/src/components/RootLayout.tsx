import { Link, useLocation, Outlet } from '@tanstack/react-router';
import { SiteNoticeTicker } from './SiteNoticeTicker';
import { FileText, CreditCard, Settings, LayoutDashboard, Lock } from 'lucide-react';
import LoginButton from './auth/LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin } from '../hooks/useIsAdmin';
import { MotivationalBanner } from './MotivationalBanner';

export function RootLayout() {
  const location = useLocation();
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();

  const showAdminLink = !!identity && isAdmin;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <SiteNoticeTicker />
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-start mb-3">
            <Link to="/" className="block">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Sarkari Job Portal
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Latest Government Jobs, Results & Admit Cards
              </p>
            </Link>
            <LoginButton />
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex flex-wrap gap-2">
            <Link
              to="/"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                location.pathname === '/'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              Home
            </Link>
            <Link
              to="/syllabus-repository"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                location.pathname === '/syllabus-repository'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <FileText className="w-4 h-4" />
              Syllabus Repository
            </Link>
            <Link
              to="/admit-card-hall"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                location.pathname === '/admit-card-hall'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Admit Card Hall
            </Link>
            {showAdminLink && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                    location.pathname === '/admin/dashboard'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/posts"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/admin/posts')
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Manage Posts
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} Sarkari Job Portal. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'sarkari-job-portal'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
              >
                caffeine.ai
              </a>
            </p>
            <Link
              to="/manage"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Lock className="w-3 h-3" />
              Admin
            </Link>
          </div>
        </div>
      </footer>
      
      <MotivationalBanner />
    </div>
  );
}
