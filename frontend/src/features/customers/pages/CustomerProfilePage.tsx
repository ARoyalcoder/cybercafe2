import { useQuery } from '@tanstack/react-query'
import { Pencil } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { RecordLoadState } from '@/components/forms/FormParts'
import { PageHeader } from '@/components/layout/PageHeader'
import { Button } from '@/components/ui/button'
import { useHasPermission } from '@/features/auth/auth-context'
import { customerQuery, type CustomerDetail } from '@/features/customers/api'
import { CustomerStatusBadge } from '@/features/customers/components/CustomerStatusBadge'
import { customerTabs } from '@/features/customers/profile/tabs'
import { cn } from '@/lib/utils'

/** Everything about one customer, one tab per subject. The open tab is in the URL (`?tab=contacts`). */
export function CustomerProfilePage() {
  const { id = '' } = useParams()
  const customer = useQuery(customerQuery(id))

  if (!customer.data) {
    return (
      <div className="grid gap-6">
        <PageHeader title="Customer" back={{ to: '/customers', label: 'Customers' }} />
        <RecordLoadState
          noun="customer"
          isPending={customer.isPending}
          error={customer.error}
          onRetry={() => void customer.refetch()}
        />
      </div>
    )
  }
  return <Profile customer={customer.data} />
}

function Profile({ customer }: { customer: CustomerDetail }) {
  const canEdit = useHasPermission('CUSTOMER_UPDATE')
  const [params, setParams] = useSearchParams()
  const active = customerTabs.find((tab) => tab.key === params.get('tab')) ?? customerTabs[0]
  const ActiveTab = active.component

  return (
    <div className="grid gap-6">
      <PageHeader
        title={customer.displayName}
        description={`${customer.customerNumber} · ${customer.type === 'BUSINESS' ? 'Business' : 'Individual'}`}
        back={{ to: '/customers', label: 'Customers' }}
        action={
          <div className="flex items-center gap-3">
            <CustomerStatusBadge status={customer.status} />
            {canEdit ? (
              <Button asChild variant="outline">
                <Link to={`/customers/${customer.id}/edit`}>
                  <Pencil aria-hidden="true" />
                  Edit
                </Link>
              </Button>
            ) : null}
          </div>
        }
      />

      <div role="tablist" aria-label="Customer sections" className="flex gap-1 overflow-x-auto border-b">
        {customerTabs.map((tab) => {
          const selected = tab.key === active.key
          const count = tab.count?.(customer)
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={selected}
              aria-controls="customer-tab-panel"
              onClick={() => setParams(tab.key === customerTabs[0].key ? {} : { tab: tab.key }, { replace: true })}
              className={cn(
                '-mb-px border-b-2 px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                selected
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
              {count !== undefined ? <span className="ml-1.5 text-xs text-muted-foreground">{count}</span> : null}
            </button>
          )
        })}
      </div>

      <div role="tabpanel" id="customer-tab-panel" aria-labelledby={`tab-${active.key}`}>
        <ActiveTab customer={customer} />
      </div>
    </div>
  )
}
