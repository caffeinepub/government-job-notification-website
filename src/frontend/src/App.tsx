import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import SyllabusRepositoryPage from './pages/SyllabusRepositoryPage';
import AdmitCardHallPage from './pages/AdmitCardHallPage';
import CheckYourAgePage from './pages/CheckYourAgePage';
import AdminPostsPage from './pages/admin/AdminPostsPage';
import AdminEditJobPostPage from './pages/admin/AdminEditJobPostPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ClientAdminPage from './pages/ClientAdminPage';
import AdminRouteGuard from './components/auth/AdminRouteGuard';
import { RootLayout } from './components/RootLayout';
import { ErrorBoundary } from './components/ErrorBoundary';

// Root route with shared layout
const rootRoute = createRootRoute({
  component: RootLayout,
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

// Syllabus Repository route
const syllabusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/syllabus-repository',
  component: SyllabusRepositoryPage,
});

// Admit Card Hall route
const admitCardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admit-card-hall',
  component: AdmitCardHallPage,
});

// Check Your Age route
const checkYourAgeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/check-your-age',
  component: CheckYourAgePage,
});

// Admin routes (Internet Identity protected with AdminRouteGuard)
const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/dashboard',
  component: () => (
    <AdminRouteGuard>
      <AdminDashboardPage />
    </AdminRouteGuard>
  ),
});

// Admin route alias
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminRouteGuard>
      <AdminDashboardPage />
    </AdminRouteGuard>
  ),
});

const adminPostsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/posts',
  component: () => (
    <AdminRouteGuard>
      <AdminPostsPage />
    </AdminRouteGuard>
  ),
});

const adminNewPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/posts/new',
  component: () => (
    <AdminRouteGuard>
      <AdminEditJobPostPage />
    </AdminRouteGuard>
  ),
});

const adminEditPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/posts/$postId/edit',
  component: () => (
    <AdminRouteGuard>
      <AdminEditJobPostPage />
    </AdminRouteGuard>
  ),
});

// Client-side admin route (password protected)
const clientAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manage',
  component: ClientAdminPage,
});

// Create router
const routeTree = rootRoute.addChildren([
  indexRoute,
  postRoute,
  syllabusRoute,
  admitCardRoute,
  checkYourAgeRoute,
  adminDashboardRoute,
  adminRoute,
  adminPostsRoute,
  adminNewPostRoute,
  adminEditPostRoute,
  clientAdminRoute,
]);
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
