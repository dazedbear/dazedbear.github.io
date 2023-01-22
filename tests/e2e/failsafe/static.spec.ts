import { test, expect } from '@playwright/test'
import get from 'lodash/get'
import {
  END_TO_END_TEST_QUERY,
  FAILSAFE_PAGE_SERVING_QUERY,
} from '../../../src/libs/constant'
import { ScreenShotOption } from '../libs/util'
import { pages } from '../../../site.config'

const screenshotOption: ScreenShotOption = {
  mask: [],
  fullPage: true,
}
// FIXME: skip these cases temporarily since there is 307 infinite redirection issue on static failsafe page.
const staticPages = [
  //'index',
  //'maintain',
]
let pagePath = ''

staticPages.forEach((pageName) => {
  test.describe(`Failsafe test for static page: ${pageName}`, () => {
    test.beforeEach(({}, testInfo) => {
      /**
       * It's important to remove `-darwin` or `-linux` suffix for snapshots / screenshots files.
       * @see https://github.com/microsoft/playwright/issues/7575#issuecomment-1168800666
       * @see https://playwright.dev/docs/api/class-testinfo#test-info-snapshot-suffix
       **/
      testInfo.snapshotSuffix = ''

      pagePath = `${get(pages, [
        pageName,
        'page',
      ])}?${END_TO_END_TEST_QUERY}=1&${FAILSAFE_PAGE_SERVING_QUERY}=1`
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
