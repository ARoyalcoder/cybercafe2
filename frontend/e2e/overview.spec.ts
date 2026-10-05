import { expect, test, type Page } from '@playwright/test'

const VERTICALS = [
  { code: 'CCTV_SECURITY', name: 'CCTV & Security', displayOrder: 1 },
  { code: 'DIGITAL_MARKETING', name: 'Digital Marketing', displayOrder: 2 },
  { code: 'INTERIOR_DESIGN', name: 'Interior Design', displayOrder: 3 },
  { code: 'ARCHITECTURE_TECH', name: 'Architecture & Tech', displayOrder: 4 },
  { code: 'SOLAR', name: 'Solar', displayOrder: 5 },
  { code: 'IT_SUPPORT', name: 'IT Support', displayOrder: 6 },
]

async function mockSystemInfo(page: Page) {
  await page.route('**/api/v1/system/info', (route) =>
    route.fulfill({
      json: { name: 'Pawan Putra Business OS', version: '0.1.0-test', apiVersion: 'v1', serverTime: '2026-01-01T00:00:00Z' },
    }),
  )
}

test('overview lists exactly the six business verticals', async ({ page }) => {
  await mockSystemInfo(page)
  await page.route('**/api/v1/service-verticals', (route) => route.fulfill({ json: VERTICALS }))

  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Overview', level: 1 })).toBeVisible()
  const table = page.getByRole('table', { name: 'Business verticals' })
  await expect(table.locator('tbody tr')).toHaveCount(6)
  for (const vertical of VERTICALS) {
    await expect(table.getByRole('cell', { name: vertical.name, exact: true })).toBeVisible()
  }
  await expect(page.getByText(/real estate/i)).toHaveCount(0)
  await expect(page.getByText('0.1.0-test')).toBeVisible()
})

test('an API failure shows the server message, the request id and a working retry', async ({ page }) => {
  await mockSystemInfo(page)
  // A flag rather than a call counter: in dev, React StrictMode mounts twice and may fetch twice.
  let failing = true
  await page.route('**/api/v1/service-verticals', (route) => {
    if (failing) {
      return route.fulfill({
        status: 403,
        contentType: 'application/problem+json',
        json: {
          type: 'urn:bos:error:forbidden',
          title: 'Access denied',
          status: 403,
          code: 'FORBIDDEN',
          detail: 'You do not have permission to perform this action',
          instance: '/api/v1/service-verticals',
          requestId: 'req-e2e-12345',
          timestamp: '2026-01-01T00:00:00Z',
        },
      })
    }
    return route.fulfill({ json: VERTICALS })
  })

  await page.goto('/')

  const alert = page.getByRole('alert')
  await expect(alert).toContainText('Could not load business verticals')
  await expect(alert).toContainText('You do not have permission to perform this action')
  await expect(alert).toContainText('req-e2e-12345')

  failing = false
  await alert.getByRole('button', { name: 'Try again' }).click()
  await expect(page.getByRole('table', { name: 'Business verticals' }).locator('tbody tr')).toHaveCount(6)
})

test('unknown routes render the not-found page inside the shell', async ({ page }) => {
  await page.goto('/no-such-page')

  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible()
  await page.getByRole('link', { name: 'Back to overview' }).click()
  await expect(page).toHaveURL('/')
})
