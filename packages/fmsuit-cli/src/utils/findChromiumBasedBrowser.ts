export type Browser = 'Chrome' | 'Edge' | 'Brave'

/**
 * Finds the executable path for a Chromium-based browser on the current platform.
 * @param {Browser} browser - The browser type (Chrome, Edge, or Brave)
 * @returns {string} The full path to the browser executable
 * @throws {Error} If the current platform is not supported or no browser is provided
 */
export function findChromiumBasedBrowser(browser: Browser): string {
  const platforms = {
    win32: {
      Chrome: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
      Edge: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      Brave:
        'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
    },
    darwin: {
      Chrome: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      Edge: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
      Brave: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
    },
    linux: {
      Chrome: '/usr/bin/google-chrome',
      Chromium: '/usr/bin/chromium',
      Edge: '/usr/bin/microsoft-edge',
      Brave: '/usr/bin/brave-browser',
    },
  }

  const platformKey = process.platform
  let currentPlatforms

  if (platformKey in platforms) {
    currentPlatforms = platforms[platformKey as keyof typeof platforms]
  } else {
    throw new Error(`The platform ${platformKey} is not supported.`)
  }

  if (browser) {
    return currentPlatforms[browser]
  } else {
    throw new Error('No browser has been provided')
  }
}
