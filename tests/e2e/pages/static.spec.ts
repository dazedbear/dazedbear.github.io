import { test, expect } from '@playwright/test'
import get from 'lodash/get'
import { END_TO_END_TEST_QUERY } from '../../../src/libs/constant'
import { ScreenShotOption } from '../libs/util'
import locator from '../libs/locator'
import { pages } from '../../../site.config'

const screenshotOption: ScreenShotOption = {
  mask: [],
  fullPage: true,
}
const staticPages = ['index', 'maintain']
let pagePath = ''

staticPages.forEach((pageName) => {
  test.describe(`Page test for static page: ${pageName}`, () => {
    test.beforeEach(({}, testInfo) => {
      /**
       * It's important to remove `-darwin` or `-linux` suffix for snapshots / screenshots files.
       * @see https://github.com/microsoft/playwright/issues/7575#issuecomment-1168800666
       * @see https://playwright.dev/docs/api/class-testinfo#test-info-snapshot-suffix
       **/
      testInfo.snapshotSuffix = ''

      pagePath = `${get(pages, [pageName, 'page'])}?${END_TO_END_TEST_QUERY}=1`
    })

    test('should have correct meta tags', async ({ page }) => {
      await page.goto(pagePath)

      const pageTitle = await page.textContent(locator.pageTitle)
      const metaDescription = await page.$(locator.meta.description)
      const metaOgTitle = await page.$(locator.meta.ogTitle)
      const metaOgImage = await page.$(locator.meta.ogImage)

      expect(pageTitle).toMatchSnapshot(`${pageName}-page-title`)
      expect(await metaDescription?.getAttribute('content')).toMatchSnapshot(
        `${pageName}-meta-description`
      )
      expect(await metaOgTitle?.getAttribute('content')).toMatchSnapshot(
        `${pageName}-meta-og-title`
      )
      expect(await metaOgImage?.getAttribute('content')).toMatchSnapshot(
        `${pageName}-meta-og-image`
      )
    })

    test('regular page should render visually the same as expected', async ({
      page,
    }) => {
      await page.goto(pagePath)
      await page.waitForTimeout(1500) // wait for layout render script execution
      await expect(page).toHaveScreenshot(
        `${pageName}-screenshot.png`,
        screenshotOption
      )
    })
  })
})
