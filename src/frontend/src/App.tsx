import { RouterProvider, createRouter, createRoute, createRootRoute, Link } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import { SiteNoticeTicker } from './components/SiteNoticeTicker';

// Root route with shared layout
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border bg-card sticky top-0 z-10 shadow-sm">
        <SiteNoticeTicker />
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="block">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Sarkari Job Portal
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Latest Government Jobs, Results & Admit Cards
            </p>
          </Link>
        </div>
      </header>
      
      <main className="flex-1">
        <div id="router-outlet" />
      </main>
      
      <footer className="border-t border-border bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
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
      </footer>
    </div>
  ),
});

// Home route
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

// Post detail route
const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/post/$postId',
  component: PostDetailPage,
});

// Create router
const routeTree = rootRoute.addChildren([indexRoute, postRoute]);
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return <RouterProvider router={router} />;
}

export default App;
