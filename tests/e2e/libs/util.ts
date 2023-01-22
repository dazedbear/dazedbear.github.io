import { Locator } from '@playwright/test'

export interface ScreenShotOption {
  mask: Locator[]
  fullPage: boolean
  maxDiffPixelRatio?: number
}

export const E2E_TEST_QUERY = 'e2e_test'
