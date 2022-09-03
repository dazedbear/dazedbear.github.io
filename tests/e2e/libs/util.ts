type BrowserName = 'chromium' | 'firefox' | 'webkit'

interface FullPageScreenShotOption {
  path: string
  fullPage: boolean
}

export const getFullPageScreenshotOption = (
  browserName: BrowserName,
  pageName: string
): FullPageScreenShotOption => {
  const SCREENSHOT_FOLDER = './artifacts/screenshots'
  if (!browserName) {
    throw Error(
      `browserName is invalid in getFullPageScreenshotPath: ${browserName}`
    )
  }
  if (!pageName) {
    throw Error(`pageName is invalid in getFullPageScreenshotPath: ${pageName}`)
  }
  const option = {
    path: `${SCREENSHOT_FOLDER}/${pageName}-page_${browserName}_${Date.now()}.png`,
    fullPage: true,
  }
  return option
}
