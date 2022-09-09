require('../../scripts/env')()
import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import env from 'env-var'
import get from 'lodash/get'
import { currentEnv, website } from '../../site.config'

const isCI = env.get('CI').default('false').asBool()

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: './',
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 30000,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.05,
      threshold: 0.2,
    },
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: isCI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: isCI
    ? [['list'], ['github']]
    : [['list'], ['html', { open: 'never' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: `${get(website, [currentEnv, 'protocol'])}://${get(website, [
      currentEnv,
      'host',
    ])}`,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'page-test-desktop',
      testDir: './pages',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    /* Test against mobile viewports. */
    {
      name: 'page-test-mobile',
      testDir: './pages',
      use: {
        ...devices['iPhone 6'],
      },
    },
    {
      name: 'api-test',
      testDir: './api',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'failsafe-test-desktop',
      testDir: './failsafe',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'failsafe-test-mobile',
      testDir: './failsafe',
      use: {
        ...devices['iPhone 6'],
      },
    },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  outputDir: '../../artifacts/',

  /* Run your local dev server before starting the tests */
  webServer: isCI
    ? undefined
    : {
        command: 'npm run dev',
        port: 3000,
      },
}

export default config
