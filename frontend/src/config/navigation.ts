import { LayoutDashboard, type LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
  /** If set, the entry is only shown to users holding this permission (e.g. 'CUSTOMER_VIEW'). */
  permission?: string
}

// Each feature module registers its top-level entry here.
export const navigation: NavItem[] = [{ label: 'Overview', to: '/', icon: LayoutDashboard }]
