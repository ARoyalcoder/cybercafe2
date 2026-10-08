import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { navigation } from '@/config/navigation'
import { useAuth } from '@/features/auth/auth-context'
import { cn } from '@/lib/utils'

/** Side rail on desktop, top bar on small screens. */
export function Sidebar() {
  const { user, signOut } = useAuth()
  const visibleItems = navigation.filter(
    (item) => !item.permission || user?.permissions.includes(item.permission),
  )

  return (
    <aside className="flex shrink-0 items-center gap-4 border-b bg-sidebar px-4 py-3 md:w-60 md:flex-col md:items-stretch md:gap-6 md:border-r md:border-b-0 md:py-6">
      <div className="flex items-center gap-2.5 md:px-2">
        <div
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground"
        >
          PP
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Pawan Putra</p>
          <p className="text-xs text-muted-foreground">Business OS</p>
        </div>
      </div>

      <nav aria-label="Main" className="flex flex-1 gap-1 md:flex-col">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive && 'bg-accent text-accent-foreground',
              )
            }
          >
            <item.icon className="size-4" aria-hidden="true" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {user ? (
        <div className="flex items-center gap-2 md:border-t md:px-2 md:pt-4">
          <div className="hidden min-w-0 flex-1 leading-tight md:block">
            <p className="truncate text-sm font-medium">{user.fullName}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Sign out" title="Sign out" onClick={() => void signOut()}>
            <LogOut aria-hidden="true" />
          </Button>
        </div>
      ) : null}
    </aside>
  )
}
