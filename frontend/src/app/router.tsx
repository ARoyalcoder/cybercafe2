import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { OverviewPage } from '@/features/system/pages/OverviewPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

// Each feature module adds its routes here as children of the shell.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
