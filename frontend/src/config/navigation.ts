import { LayoutDashboard, type LucideIcon } from 'lucide-react'

export type NavItem = {
  label: string
  to: string
  icon: LucideIcon
}

// Each feature module registers its top-level entry here.
export const navigation: NavItem[] = [{ label: 'Overview', to: '/', icon: LayoutDashboard }]
