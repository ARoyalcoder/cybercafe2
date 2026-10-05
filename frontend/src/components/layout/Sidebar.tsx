import { NavLink } from 'react-router-dom'
import { navigation } from '@/config/navigation'
import { cn } from '@/lib/utils'

/** Side rail on desktop, top bar on small screens. */
export function Sidebar() {
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

      <nav aria-label="Main" className="flex gap-1 md:flex-col">
        {navigation.map((item) => (
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
    </aside>
  )
}
