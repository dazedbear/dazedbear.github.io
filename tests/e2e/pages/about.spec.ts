import { test, expect } from '@playwright/test'
import { FAILSAFE_PAGE_SERVING_QUERY } from '../../../src/libs/constant'
import { E2E_TEST_QUERY, ScreenShotOption } from '../libs/util'
import locator from '../libs/locator'

const PAGE_PATH = `/about?${E2E_TEST_QUERY}`
const screenshotOption: ScreenShotOption = {
  mask: [],
  fullPage: true,
}

test.describe('About Page', () => {
  test.beforeEach(({ page }, testInfo) => {
    /**
     * It's important to remove `-darwin` or `-linux` suffix for snapshots / screenshots files.
     * @see https://github.com/microsoft/playwright/issues/7575#issuecomment-1168800666
     * @see https://playwright.dev/docs/api/class-testinfo#test-info-snapshot-suffix
     **/
    testInfo.snapshotSuffix = ''

    /**
     * mask notion content with pink block
     * @see https://playwright.dev/docs/test-assertions#locator-assertions-to-have-screenshot-1-option-mask
     **/
    screenshotOption.mask = [page.locator(locator.pages.about.notionContent)]
  })

  test('should have correct meta tags', async ({ page }) => {
    await page.goto(PAGE_PATH)

    const pageTitle = await page.textContent(locator.pageTitle)
    const metaDescription = await page.$(locator.meta.description)
    const metaOgTitle = await page.$(locator.meta.ogTitle)
    const metaOgImage = await page.$(locator.meta.ogImage)

    expect(pageTitle).toMatchSnapshot('page-title')
    expect(await metaDescription?.getAttribute('content')).toMatchSnapshot(
      'meta-description'
    )
    expect(await metaOgTitle?.getAttribute('content')).toMatchSnapshot(
      'meta-og-title'
    )
    expect(await metaOgImage?.getAttribute('content')).toMatchSnapshot(
      'meta-ot-image'
    )
  })

  test('should render notion wrapper and content', async ({ page }) => {
    await page.goto(PAGE_PATH)
    expect(await page.$(locator.pages.about.notionWrapper)).not.toBeNull()
    expect(await page.$(locator.pages.about.notionContent)).not.toBeNull()
  })

  test('regular page should render visually the same as expected', async ({
    page,
  }) => {
    await page.goto(PAGE_PATH)
    await expect(page).toHaveScreenshot('screenshot.png', screenshotOption)
  })

  // FIXME: skip this case temporarily since there is 307 infinite redirection issue on index failsafe page.
  test.skip('static failsafe page should render visually the same as the regular page', async ({
    page,
  }) => {
    await page.goto(`${PAGE_PATH}&${FAILSAFE_PAGE_SERVING_QUERY}=1`)
    await expect(page).toHaveScreenshot('screenshot.png', screenshotOption)
  })
})
