import { test, expect } from '@playwright/test'
import { meta, pages } from '../../../site.config'
import { getFullPageScreenshotOption } from '../libs/util'

test('index page has title', async ({ page, browserName }) => {
  await page.goto('/')
  await page.screenshot(getFullPageScreenshotOption(browserName, 'index'))
  await expect(page).toHaveTitle(`${pages.index.title} · ${meta.title}`)
})
