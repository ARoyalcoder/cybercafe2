import type { ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { AuditLogDetailPage } from '@/features/audit/pages/AuditLogDetailPage'
import { AuditLogPage } from '@/features/audit/pages/AuditLogPage'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { RequirePermission } from '@/features/auth/components/RequirePermission'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { CategoriesPage } from '@/features/catalog/pages/CategoriesPage'
import { CategoryFormPage } from '@/features/catalog/pages/CategoryFormPage'
import { ServiceFormPage } from '@/features/catalog/pages/ServiceFormPage'
import { ServicesPage } from '@/features/catalog/pages/ServicesPage'
import { VerticalFormPage } from '@/features/catalog/pages/VerticalFormPage'
import { VerticalsPage } from '@/features/catalog/pages/VerticalsPage'
import { BranchesPage } from '@/features/organization/pages/BranchesPage'
import { BranchFormPage } from '@/features/organization/pages/BranchFormPage'
import { CustomerFormPage } from '@/features/customers/pages/CustomerFormPage'
import { CustomerProfilePage } from '@/features/customers/pages/CustomerProfilePage'
import { CustomersPage } from '@/features/customers/pages/CustomersPage'
import { OverviewPage } from '@/features/system/pages/OverviewPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

const needs = (permission: string, page: ReactNode) => (
  <RequirePermission permission={permission}>{page}</RequirePermission>
)

// Everything except /login is behind RequireAuth, and each admin page names the permission it needs.
// These guards only decide what to show; the API enforces the same rules on every request.
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

          { path: 'customers', element: needs('CUSTOMER_VIEW', <CustomersPage />) },
          { path: 'customers/new', element: needs('CUSTOMER_CREATE', <CustomerFormPage />) },
          { path: 'customers/:id', element: needs('CUSTOMER_VIEW', <CustomerProfilePage />) },
          { path: 'customers/:id/edit', element: needs('CUSTOMER_UPDATE', <CustomerFormPage />) },

          { path: 'admin/services', element: needs('CATALOG_VIEW', <ServicesPage />) },
          { path: 'admin/services/new', element: needs('CATALOG_CREATE', <ServiceFormPage />) },
          { path: 'admin/services/:id/edit', element: needs('CATALOG_UPDATE', <ServiceFormPage />) },

          { path: 'admin/categories', element: needs('CATALOG_VIEW', <CategoriesPage />) },
          { path: 'admin/categories/new', element: needs('CATALOG_CREATE', <CategoryFormPage />) },
          { path: 'admin/categories/:id/edit', element: needs('CATALOG_UPDATE', <CategoryFormPage />) },

          { path: 'admin/verticals', element: needs('CATALOG_VIEW', <VerticalsPage />) },
          { path: 'admin/verticals/:code/edit', element: needs('CATALOG_UPDATE', <VerticalFormPage />) },

          { path: 'admin/branches', element: needs('BRANCH_VIEW', <BranchesPage />) },
          { path: 'admin/branches/new', element: needs('BRANCH_CREATE', <BranchFormPage />) },
          { path: 'admin/branches/:id/edit', element: needs('BRANCH_UPDATE', <BranchFormPage />) },

          { path: 'admin/audit', element: needs('AUDIT_VIEW', <AuditLogPage />) },
          { path: 'admin/audit/:id', element: needs('AUDIT_VIEW', <AuditLogDetailPage />) },

          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
])
