import { Link, useLocation, Outlet, useNavigate } from '@tanstack/react-router';
import { SiteNoticeTicker } from './SiteNoticeTicker';
import { Sun, Moon, Briefcase } from 'lucide-react';
import LoginButton from './auth/LoginButton';
import { MotivationalBanner } from './MotivationalBanner';
import { FloatingSocialButtons } from './FloatingSocialButtons';
import { JobSearchProvider, useJobSearch } from '../contexts/JobSearchContext';
import { Input } from './ui/input';
import { useThemePreference } from '../hooks/useThemePreference';
import { Button } from './ui/button';

function HeaderContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useJobSearch();
  const { theme, toggleTheme } = useThemePreference();

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate({ to: '/' });
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleAdminPanelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate({ to: '/admin/dashboard' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <SiteNoticeTicker />
        
        {/* Clean Header Bar */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Logo + Site Name */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                Sarkari Job Portal
              </h1>
            </Link>

            {/* Search Bar + Theme Toggle + Login */}
            <div className="flex items-center gap-2 flex-1 md:flex-initial md:max-w-md">
              <Input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex-shrink-0"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </Button>
              <LoginButton />
            </div>
          </div>
        </div>

        {/* Clean Tab Navigation */}
        <div className="border-t border-border bg-secondary/30">
          <div className="container mx-auto px-4">
            <nav className="flex items-center gap-1 overflow-x-auto">
              <Link
                to="/"
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  location.pathname === '/'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                Home
              </Link>
              <Link
                to="/check-your-age"
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  location.pathname === '/check-your-age'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                Age Calculator
              </Link>
              <button
                onClick={() => scrollToSection('daily-quiz')}
                className="px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
              >
                Quiz Zone
              </button>
              <button
                onClick={() => scrollToSection('study-material')}
                className="px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 border-transparent text-muted-foreground hover:border-muted"
              >
                Study Material
              </button>
              <button
                onClick={handleAdminPanelClick}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ml-auto ${
                  location.pathname.startsWith('/admin')
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                Admin Panel
              </button>
            </nav>
          </div>
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
          </div>
        </div>
      </footer>
      
      <MotivationalBanner />
      <FloatingSocialButtons />
    </div>
  );
}

export function RootLayout() {
  return (
    <JobSearchProvider>
      <HeaderContent />
    </JobSearchProvider>
  );
}
