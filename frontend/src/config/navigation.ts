import {
  Building2,
  FolderTree,
  Layers,
  LayoutDashboard,
  ScrollText,
  Users,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  /** If set, the entry is only shown to users holding this permission (e.g. 'CUSTOMER_VIEW'). */
  permission?: string
}

export type NavSection = {
  /** Heading above the group; omitted for the first, untitled group. */
  title?: string
  items: NavItem[]
}

// Each feature module registers its entries here. A section with no visible items is not shown.
export const navigation: NavSection[] = [
  {
    items: [
      { label: 'Overview', to: '/', icon: LayoutDashboard },
      { label: 'Customers', to: '/customers', icon: Users, permission: 'CUSTOMER_VIEW' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { label: 'Services', to: '/admin/services', icon: Wrench, permission: 'CATALOG_VIEW' },
      { label: 'Categories', to: '/admin/categories', icon: FolderTree, permission: 'CATALOG_VIEW' },
      { label: 'Verticals', to: '/admin/verticals', icon: Layers, permission: 'CATALOG_VIEW' },
      { label: 'Branches', to: '/admin/branches', icon: Building2, permission: 'BRANCH_VIEW' },
    ],
  },
  {
    title: 'Administration',
    items: [{ label: 'Audit log', to: '/admin/audit', icon: ScrollText, permission: 'AUDIT_VIEW' }],
  },
]
