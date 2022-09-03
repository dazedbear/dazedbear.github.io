import { test, expect } from '@playwright/test'

test('should get sitemap correctly', async ({ request }) => {
  const response = await request.get('/api/sitemap')
  expect(response.ok()).toBeTruthy()
})
