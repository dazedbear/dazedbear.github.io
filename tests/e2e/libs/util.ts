import { Locator } from '@playwright/test'

export interface ScreenShotOption {
  mask: Locator[]
  fullPage: boolean
  maxDiffPixelRatio?: number
}
