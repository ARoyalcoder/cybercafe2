import { expect, test, type Page } from '@playwright/test'
import { mockSignedIn, mockSystemInfo, mockVerticals, pageOf, problem } from './support'

const SALES = ['CUSTOMER_VIEW', 'CUSTOMER_CREATE', 'CUSTOMER_UPDATE', 'CUSTOMER_DELETE', 'CUSTOMER_EXPORT']
const ID = '66666666-6666-6666-6666-666666666666'
const ASSIGNEE = { id: '77777777-7777-7777-7777-777777777777', name: 'Asha Verma' }
const VIP = { id: '88888888-8888-8888-8888-888888888888', name: 'VIP' }

function customer(overrides: Record<string, unknown> = {}) {
  return {
    id: ID,
    customerNumber: 'CUS-001001',
    type: 'BUSINESS',
    displayName: 'Acme Solar',
    firstName: null,
    lastName: null,
    companyName: 'Acme Solar',
    taxId: '09ABCDE1234F1Z5',
    email: 'info@acme.example',
    phone: '+91 98765 43210',
    status: 'ACTIVE',
    source: 'REFERRAL',
    assignedTo: ASSIGNEE,
    tags: ['VIP'],
    contactCount: 1,
    addressCount: 2,
    version: 3,
    createdAt: '2026-10-01T09:00:00Z',
    updatedAt: '2026-10-05T10:15:30Z',
    ...overrides,
  }
}

async function mockLookups(page: Page) {
  await page.route('**/api/v1/customers/tags', (route) => route.fulfill({ json: [VIP] }))
  await page.route('**/api/v1/customers/assignees', (route) => route.fulfill({ json: [ASSIGNEE] }))
}

test.beforeEach(async ({ page }) => {
  await mockSystemInfo(page)
  await mockVerticals(page)
})

test('customer list searches, filters, sorts, pages and exports what is shown', async ({ page }) => {
  await mockSignedIn(page, SALES)
  await mockLookups(page)
  const requests: URLSearchParams[] = []
  let exportRequest: URLSearchParams | undefined
  await page.route('**/api/v1/customers/export**', (route) => {
    exportRequest = new URL(route.request().url()).searchParams
    return route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=UTF-8',
        'Content-Disposition': 'attachment; filename="customers-2026-10-08.csv"',
      },
      body: '﻿Customer no.,Name\r\nCUS-001001,Acme Solar\r\n',
    })
  })
  await page.route('**/api/v1/customers?*', (route) => {
    const params = new URL(route.request().url()).searchParams
    requests.push(params)
    return route.fulfill({ json: pageOf([customer()], Number(params.get('page') ?? '0'), 45) })
  })

  await page.goto('/')
  await page.getByRole('link', { name: 'Customers' }).click()
  await expect(page).toHaveURL('/customers')

  const table = page.getByRole('table', { name: 'Customers' })
  await expect(table).toContainText('Acme Solar')
  await expect(table).toContainText('CUS-001001')
  await expect(table).toContainText('+91 98765 43210')
  await expect(table).toContainText('Asha Verma')
  await expect(table).toContainText('VIP')
  await expect(page.getByText('45 customers · page 1 of 3')).toBeVisible()

  await page.getByRole('searchbox', { name: 'Search customers' }).fill('acme')
  await expect.poll(() => requests.at(-1)?.get('search')).toBe('acme')
  await page.getByLabel('Type').selectOption('BUSINESS')
  await page.getByLabel('Status').selectOption('ACTIVE')
  await page.getByLabel('Source').selectOption('REFERRAL')
  await page.getByLabel('Assigned to').selectOption(ASSIGNEE.id)
  await page.getByLabel('Tag').selectOption(VIP.id)
  await page.getByLabel('Sort by').selectOption('createdAt,desc')
  await expect.poll(() => requests.at(-1)?.get('sort')).toBe('createdAt,desc')
  const last = requests.at(-1)!
  expect(Object.fromEntries(last)).toMatchObject({
    search: 'acme',
    type: 'BUSINESS',
    status: 'ACTIVE',
    source: 'REFERRAL',
    assignedTo: ASSIGNEE.id,
    tagId: VIP.id,
    sort: 'createdAt,desc',
  })

  await page.getByRole('button', { name: 'Next' }).click()
  await expect.poll(() => requests.at(-1)?.get('page')).toBe('1')

  // The export is the whole filtered list, not the page on screen.
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Export CSV' }).click()
  expect((await download).suggestedFilename()).toBe('customers-2026-10-08.csv')
  expect(Object.fromEntries(exportRequest!)).toEqual({
    search: 'acme',
    type: 'BUSINESS',
    status: 'ACTIVE',
    source: 'REFERRAL',
    assignedTo: ASSIGNEE.id,
    tagId: VIP.id,
    sort: 'createdAt,desc',
  })
})

test('the form asks for the right name for an individual and for a business', async ({ page }) => {
  await mockSignedIn(page, SALES)
  await mockLookups(page)

  await page.goto('/customers/new')
  await expect(page.getByLabel('First name')).toBeVisible()
  await expect(page.getByLabel('Company name')).toHaveCount(0)
  await page.getByLabel('Phone').fill('call me')
  await page.getByLabel('Email').fill('not-an-email')
  await page.getByRole('button', { name: 'Create customer' }).click()
  await expect(page.getByText('Enter the first name')).toBeVisible()
  await expect(page.getByText('Enter a phone number')).toBeVisible()
  await expect(page.getByText('Enter a valid email address')).toBeVisible()

  await page.getByLabel('Customer type').selectOption('BUSINESS')
  await expect(page.getByLabel('Company name')).toBeVisible()
  await expect(page.getByLabel('GSTIN')).toBeVisible()
  await expect(page.getByLabel('First name')).toHaveCount(0)
  await page.getByRole('button', { name: 'Create customer' }).click()
  await expect(page.getByText('Enter the company name')).toBeVisible()
})

test('a possible duplicate is shown before saving, and the user can save anyway', async ({ page }) => {
  await mockSignedIn(page, SALES)
  await mockLookups(page)
  const checks: Record<string, unknown>[] = []
  await page.route('**/api/v1/customers/duplicate-check', (route) => {
    checks.push(route.request().postDataJSON() as Record<string, unknown>)
    return route.fulfill({
      json: [
        {
          id: ID,
          customerNumber: 'CUS-001001',
          displayName: 'Acme Solar',
          type: 'BUSINESS',
          email: 'info@acme.example',
          phone: '+91 98765 43210',
          status: 'ACTIVE',
          matchedOn: ['PHONE', 'COMPANY_NAME'],
        },
      ],
    })
  })
  const created: Record<string, unknown>[] = []
  await page.route('**/api/v1/customers', (route) => {
    created.push(route.request().postDataJSON() as Record<string, unknown>)
    return route.fulfill({ status: 201, json: customer({ id: 'new-customer', displayName: 'Acme Solar Ltd' }) })
  })
  await page.route('**/api/v1/customers/new-customer', (route) =>
    route.fulfill({ json: customer({ id: 'new-customer', displayName: 'Acme Solar Ltd' }) }),
  )
  await page.route('**/api/v1/customers/new-customer/notes**', (route) => route.fulfill({ json: pageOf([]) }))

  await page.goto('/customers/new')
  await page.getByLabel('Customer type').selectOption('BUSINESS')
  await page.getByLabel('Company name').fill('Acme Solar Ltd')
  await page.getByLabel('Phone').fill('9876543210')
  await page.getByLabel('Tags').fill('VIP, Builder, vip')
  await page.getByRole('button', { name: 'Create customer' }).click()

  // Nothing was saved; the existing customer is shown with the reasons it matched.
  const warning = page.getByRole('alertdialog', { name: 'This may already be a customer' })
  await expect(warning).toContainText('Acme Solar')
  await expect(warning).toContainText('CUS-001001')
  await expect(warning).toContainText('same phone')
  await expect(warning).toContainText('same company name')
  await expect(warning.getByRole('link', { name: 'Acme Solar' })).toHaveAttribute('href', `/customers/${ID}`)
  expect(created).toHaveLength(0)
  expect(checks[0]).toMatchObject({ phone: '9876543210', email: null, companyName: 'Acme Solar Ltd' })

  // "Go back and edit" returns to the form without saving.
  await warning.getByRole('button', { name: 'Go back and edit' }).click()
  await expect(page.getByRole('button', { name: 'Create customer' })).toBeVisible()
  expect(created).toHaveLength(0)

  await page.getByRole('button', { name: 'Create customer' }).click()
  await page.getByRole('button', { name: 'Save anyway' }).click()

  await expect(page).toHaveURL('/customers/new-customer')
  expect(created).toHaveLength(1)
  expect(created[0]).toMatchObject({
    type: 'BUSINESS',
    companyName: 'Acme Solar Ltd',
    firstName: null,
    phone: '9876543210',
    tags: ['VIP', 'Builder'],
    confirmDuplicates: true,
  })
})

test('a customer with no duplicates is created straight away', async ({ page }) => {
  await mockSignedIn(page, SALES)
  await mockLookups(page)
  await page.route('**/api/v1/customers/duplicate-check', (route) => route.fulfill({ json: [] }))
  let created: Record<string, unknown> | undefined
  await page.route('**/api/v1/customers', (route) => {
    created = route.request().postDataJSON() as Record<string, unknown>
    return route.fulfill({ status: 201, json: customer({ id: 'ravi', type: 'INDIVIDUAL', displayName: 'Ravi Kumar' }) })
  })
  await page.route('**/api/v1/customers/ravi', (route) =>
    route.fulfill({ json: customer({ id: 'ravi', type: 'INDIVIDUAL', displayName: 'Ravi Kumar' }) }),
  )
  await page.route('**/api/v1/customers/ravi/notes**', (route) => route.fulfill({ json: pageOf([]) }))

  await page.goto('/customers/new')
  await page.getByLabel('First name').fill('Ravi')
  await page.getByLabel('Last name').fill('Kumar')
  await page.getByLabel('Status').selectOption('PROSPECT')
  await page.getByLabel('Source').selectOption('WALK_IN')
  await page.getByLabel('Assigned to').selectOption(ASSIGNEE.id)
  await page.getByRole('button', { name: 'Create customer' }).click()

  await expect(page).toHaveURL('/customers/ravi')
  await expect(page.getByRole('heading', { name: 'Ravi Kumar', level: 1 })).toBeVisible()
  expect(created).toEqual({
    type: 'INDIVIDUAL',
    firstName: 'Ravi',
    lastName: 'Kumar',
    companyName: null,
    taxId: null,
    phone: null,
    email: null,
    status: 'PROSPECT',
    source: 'WALK_IN',
    assignedUserId: ASSIGNEE.id,
    tags: [],
    confirmDuplicates: false,
  })
})

test('if the server finds a duplicate the form shows the matches instead of an error', async ({ page }) => {
  await mockSignedIn(page, SALES)
  await mockLookups(page)
  // First check finds nothing; someone else then creates the same customer before we save.
  let checkCalls = 0
  await page.route('**/api/v1/customers/duplicate-check', (route) => {
    checkCalls += 1
    return route.fulfill({
      json:
        checkCalls === 1
          ? []
          : [{ id: ID, customerNumber: 'CUS-001001', displayName: 'Acme Solar', status: 'ACTIVE', matchedOn: ['EMAIL'] }],
    })
  })
  await page.route('**/api/v1/customers', (route) =>
    route.fulfill(problem(409, 'POSSIBLE_DUPLICATE', 'An existing customer has the same phone, email or company name')),
  )

  await page.goto('/customers/new')
  await page.getByLabel('First name').fill('Ravi')
  await page.getByLabel('Email').fill('info@acme.example')
  await page.getByRole('button', { name: 'Create customer' }).click()

  await expect(page.getByRole('alertdialog')).toContainText('same email')
  await expect(page.getByRole('button', { name: 'Save anyway' })).toBeVisible()
})

test('customer profile has every section, and the built ones work', async ({ page }) => {
  await mockSignedIn(page, SALES)
  await page.route(`**/api/v1/customers/${ID}`, (route) => route.fulfill({ json: customer() }))
  const notes = [{ id: 'n1', body: 'Prefers calls after 5 pm.', authorName: 'Asha Verma', createdAt: '2026-10-02T09:00:00Z' }]
  await page.route(`**/api/v1/customers/${ID}/notes**`, (route) => {
    if (route.request().method() === 'POST') {
      const body = (route.request().postDataJSON() as { body: string }).body
      notes.unshift({ id: 'n2', body, authorName: 'Asha Verma', createdAt: '2026-10-08T09:00:00Z' })
      return route.fulfill({ status: 201, json: notes[0] })
    }
    return route.fulfill({ json: pageOf(notes) })
  })
  const contacts = [
    { id: 'c1', name: 'Asha Verma', designation: 'Owner', email: 'asha@acme.example', phone: '9876543210', primaryContact: true, version: 0 },
  ]
  let newContact: Record<string, unknown> | undefined
  await page.route(`**/api/v1/customers/${ID}/contacts`, (route) => {
    if (route.request().method() === 'POST') {
      newContact = route.request().postDataJSON() as Record<string, unknown>
      contacts.push({ id: 'c2', name: 'Ravi Kumar', designation: null as unknown as string, email: null as unknown as string, phone: '9000000001', primaryContact: false, version: 0 })
      return route.fulfill({ status: 201, json: contacts[1] })
    }
    return route.fulfill({ json: contacts })
  })
  await page.route(`**/api/v1/customers/${ID}/addresses`, (route) =>
    route.fulfill({
      json: [
        { id: 'a1', type: 'BILLING', label: 'Head office', line1: '12 MG Road', city: 'Lucknow', state: 'Uttar Pradesh', postalCode: '226001', countryCode: 'IN', defaultAddress: true, version: 0 },
        { id: 'a2', type: 'SERVICE', label: 'Warehouse', line1: 'Plot 4', city: 'Kanpur', state: 'Uttar Pradesh', countryCode: 'IN', defaultAddress: true, version: 0 },
      ],
    }),
  )
  await page.route(`**/api/v1/customers/${ID}/activity**`, (route) =>
    route.fulfill({
      json: pageOf([
        { id: 'e2', occurredAt: '2026-10-05T10:15:30Z', action: 'CREATE', actorLabel: 'asha@example.com', message: "Created Contact 'Asha Verma'", changes: [] },
        { id: 'e1', occurredAt: '2026-10-01T09:00:00Z', action: 'STATUS_CHANGE', actorLabel: 'asha@example.com', message: "Changed status to ACTIVE for Customer 'Acme Solar'", changes: [{ field: 'status', from: 'PROSPECT', to: 'ACTIVE' }] },
      ]),
    }),
  )

  await page.goto(`/customers/${ID}`)

  await expect(page.getByRole('heading', { name: 'Acme Solar', level: 1 })).toBeVisible()
  await expect(page.getByText('CUS-001001 · Business')).toBeVisible()
  // All fifteen sections are there, in order.
  await expect(page.getByRole('tab')).toHaveText([
    /^Overview/, /^Contacts\s*1$/, /^Addresses\s*2$/, /^Activities/, /^Leads/, /^Opportunities/, /^Quotations/,
    /^Orders/, /^Projects/, /^Invoices/, /^Payments/, /^Tickets/, /^AMC/, /^Warranty/, /^Documents/,
  ])

  // Overview
  const panel = page.getByRole('tabpanel')
  await expect(panel).toContainText('09ABCDE1234F1Z5')
  await expect(panel).toContainText('Referral')
  await expect(panel).toContainText('Asha Verma')
  await expect(panel.getByRole('list', { name: 'Notes' })).toContainText('Prefers calls after 5 pm.')
  await panel.getByLabel('New note').fill('Asked for a rooftop quote.')
  await panel.getByRole('button', { name: 'Add note' }).click()
  await expect(panel.getByRole('list', { name: 'Notes' }).getByRole('listitem').first()).toContainText('Asked for a rooftop quote.')

  // Contacts
  await page.getByRole('tab', { name: /^Contacts/ }).click()
  await expect(page).toHaveURL(/tab=contacts/)
  await expect(panel.getByRole('list', { name: 'Contacts' })).toContainText('Asha Verma')
  await expect(panel.getByRole('list', { name: 'Contacts' })).toContainText('Primary')
  await panel.getByRole('button', { name: 'Add contact' }).click()
  const contactForm = panel.getByRole('form', { name: 'New contact' })
  await contactForm.getByRole('button', { name: 'Add contact' }).click()
  await expect(contactForm.getByText('Enter a name')).toBeVisible()
  await contactForm.getByLabel('Name').fill('Ravi Kumar')
  await contactForm.getByLabel('Phone').fill('9000000001')
  await contactForm.getByRole('button', { name: 'Add contact' }).click()
  await expect(panel.getByRole('list', { name: 'Contacts' })).toContainText('Ravi Kumar')
  expect(newContact).toEqual({ name: 'Ravi Kumar', designation: null, phone: '9000000001', email: null, primaryContact: false })

  // Addresses
  await page.getByRole('tab', { name: /^Addresses/ }).click()
  const addresses = panel.getByRole('list', { name: 'Addresses' })
  await expect(addresses.getByRole('listitem').filter({ hasText: 'Billing' })).toContainText('12 MG Road')
  await expect(addresses.getByRole('listitem').filter({ hasText: 'Service' })).toContainText('Kanpur')

  // Activities
  await page.getByRole('tab', { name: /^Activities/ }).click()
  await expect(panel.getByRole('list', { name: 'Activity' })).toContainText("Created Contact 'Asha Verma'")
  await expect(panel.getByRole('list', { name: 'Activity' })).toContainText('status: PROSPECT → ACTIVE')

  // Sections whose module is not built say so, rather than looking empty.
  for (const section of ['Leads', 'Quotations', 'Invoices', 'Tickets', 'AMC', 'Warranty', 'Documents']) {
    await page.getByRole('tab', { name: new RegExp(`^${section}`) }).click()
    await expect(panel.getByRole('heading', { name: `${section} are not available yet` })).toBeVisible()
  }

  // The open tab is in the URL, so a link or a refresh returns to it.
  await page.goto(`/customers/${ID}?tab=addresses`)
  await expect(page.getByRole('tab', { name: /^Addresses/ })).toHaveAttribute('aria-selected', 'true')
})

test('a view-only user sees customers but none of the controls that change or export them', async ({ page }) => {
  await mockSignedIn(page, ['CUSTOMER_VIEW'])
  await mockLookups(page)
  await page.route('**/api/v1/customers?*', (route) => route.fulfill({ json: pageOf([customer()]) }))
  await page.route('**/api/v1/customers', (route) => route.fulfill({ json: pageOf([customer()]) }))
  await page.route(`**/api/v1/customers/${ID}`, (route) => route.fulfill({ json: customer() }))
  await page.route(`**/api/v1/customers/${ID}/notes**`, (route) => route.fulfill({ json: pageOf([]) }))
  await page.route(`**/api/v1/customers/${ID}/contacts`, (route) => route.fulfill({ json: [] }))

  await page.goto('/customers')
  await expect(page.getByRole('table', { name: 'Customers' })).toContainText('Acme Solar')
  await expect(page.getByRole('link', { name: 'New customer' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Export CSV' })).toHaveCount(0)

  await page.getByRole('link', { name: 'Acme Solar' }).click()
  await expect(page.getByRole('heading', { name: 'Acme Solar', level: 1 })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Edit' })).toHaveCount(0)
  await expect(page.getByLabel('New note')).toHaveCount(0)
  await page.getByRole('tab', { name: /^Contacts/ }).click()
  await expect(page.getByRole('button', { name: 'Add contact' })).toHaveCount(0)

  await page.goto('/customers/new')
  await expect(page.getByRole('heading', { name: "You don't have access to this page" })).toBeVisible()
})

test('customers are hidden from users without the permission', async ({ page }) => {
  await mockSignedIn(page, ['CATALOG_VIEW'])

  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Customers' })).toHaveCount(0)
  await page.goto('/customers')
  await expect(page.getByRole('heading', { name: "You don't have access to this page" })).toBeVisible()
})
