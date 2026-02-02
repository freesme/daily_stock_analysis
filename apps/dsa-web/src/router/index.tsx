import { createBrowserRouter, Navigate } from 'react-router';
import { lazy, Suspense } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LoadingScreen from '@/components/common/LoadingScreen';

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const AnalysisPage = lazy(() => import('@/pages/AnalysisPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const TasksPage = lazy(() => import('@/pages/TasksPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Suspense wrapper for lazy loaded components
function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<LoadingScreen />}>{children}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <LazyPage>
            <DashboardPage />
          </LazyPage>
        ),
      },
      {
        path: 'analysis',
        element: (
          <LazyPage>
            <AnalysisPage />
          </LazyPage>
        ),
      },
      {
        path: 'analysis/:taskId',
        element: (
          <LazyPage>
            <AnalysisPage />
          </LazyPage>
        ),
      },
      {
        path: 'history',
        element: (
          <LazyPage>
            <HistoryPage />
          </LazyPage>
        ),
      },
      {
        path: 'tasks',
        element: (
          <LazyPage>
            <TasksPage />
          </LazyPage>
        ),
      },
      {
        path: 'settings',
        element: (
          <LazyPage>
            <SettingsPage />
          </LazyPage>
        ),
      },
      {
        path: '*',
        element: (
          <LazyPage>
            <NotFoundPage />
          </LazyPage>
        ),
      },
    ],
  },
]);

export default router;
