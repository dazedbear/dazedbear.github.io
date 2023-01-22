import { test, expect } from '@playwright/test'
import get from 'lodash/get'
import { FAILSAFE_PAGE_SERVING_QUERY } from '../../../src/libs/constant'
import { E2E_TEST_QUERY, ScreenShotOption } from '../libs/util'
import locator from '../libs/locator'

const screenshotOption: ScreenShotOption = {
  mask: [],
  maxDiffPixelRatio: 0.02,
  fullPage: false,
}
const notionPages = ['article', 'coding', 'music']
let pagePath = ''

notionPages.forEach((pageName) => {
  test.describe(`Failsafe test for Notion article list page: ${pageName}`, () => {
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
      screenshotOption.mask = [
        page.locator(get(locator, ['pages', pageName, 'notionContent'])),
        page.locator(get(locator, ['pages', pageName, 'navigationMenu'])),
      ]

      pagePath = `/${pageName}?${E2E_TEST_QUERY}&${FAILSAFE_PAGE_SERVING_QUERY}=1`
    })

    test('static failsafe page should render visually the same as expected', async ({
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
