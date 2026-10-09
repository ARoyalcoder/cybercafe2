import type { ComponentType } from 'react'
import type { CustomerDetail } from '@/features/customers/api'
import { ActivitiesTab } from '@/features/customers/profile/ActivitiesTab'
import { AddressesTab } from '@/features/customers/profile/AddressesTab'
import { ContactsTab } from '@/features/customers/profile/ContactsTab'
import { NotBuiltYetTab } from '@/features/customers/profile/NotBuiltYetTab'
import { OverviewTab } from '@/features/customers/profile/OverviewTab'

export type CustomerTabProps = { customer: CustomerDetail }

export type CustomerTab = {
  /** Used in the URL: /customers/:id?tab=contacts */
  key: string
  label: string
  /** A number shown next to the label, when it is known. */
  count?: (customer: CustomerDetail) => number
  component: ComponentType<CustomerTabProps>
}

/** A tab whose module does not exist yet. It says so plainly instead of pretending to be empty. */
function notBuilt(key: string, label: string, plural: string): CustomerTab {
  return { key, label, component: () => <NotBuiltYetTab label={label} plural={plural} /> }
}

/**
 * The tabs of the customer profile, in order.
 *
 * This is where a module plugs itself into the profile: when Leads is built, it replaces its
 * `notBuilt(...)` line with `{ key: 'leads', label: 'Leads', component: CustomerLeadsTab }`, and its
 * component receives the customer. Nothing else in the profile changes.
 */
export const customerTabs: CustomerTab[] = [
  { key: 'overview', label: 'Overview', component: OverviewTab },
  { key: 'contacts', label: 'Contacts', count: (customer) => customer.contactCount, component: ContactsTab },
  { key: 'addresses', label: 'Addresses', count: (customer) => customer.addressCount, component: AddressesTab },
  { key: 'activities', label: 'Activities', component: ActivitiesTab },
  notBuilt('leads', 'Leads', 'leads'),
  notBuilt('opportunities', 'Opportunities', 'opportunities'),
  notBuilt('quotations', 'Quotations', 'quotations'),
  notBuilt('orders', 'Orders', 'orders'),
  notBuilt('projects', 'Projects', 'projects'),
  notBuilt('invoices', 'Invoices', 'invoices'),
  notBuilt('payments', 'Payments', 'payments'),
  notBuilt('tickets', 'Tickets', 'support tickets'),
  notBuilt('amc', 'AMC', 'maintenance contracts'),
  notBuilt('warranty', 'Warranty', 'warranties'),
  notBuilt('documents', 'Documents', 'documents'),
]
