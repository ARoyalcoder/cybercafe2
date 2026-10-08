import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { OverviewPage } from '@/features/system/pages/OverviewPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Everything except /login is behind RequireAuth. Each feature module adds its routes as children of
// the shell and wraps pages that need a permission in <RequirePermission>. These guards only decide
// what to show; the API enforces the same rules on every request.
export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <OverviewPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
