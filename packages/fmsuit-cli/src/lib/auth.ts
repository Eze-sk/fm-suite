import puppeteer from "puppeteer-core";
import { DATA_DIR, CACHE_FILE } from "../consts/safeRoutes"
import { existsSync } from 'node:fs';
import { findChromiumBasedBrowser, type Browser } from "../utils/findChromiumBasedBrowser";
import defaultBrowser from "default-browser";

const browser = await defaultBrowser()
const BROWSER_PATH = findChromiumBasedBrowser(browser.name as Browser)

type ReturnVerifySession = {
  status: boolean,
  loginLink: string | null
}

const FM_URL = "https://www.frontendmentor.io"

/**
 * Verifies if a user session is valid by checking the Frontend Mentor website.
 * @returns {Promise<ReturnVerifySession>} An object containing the session status and login link if available
 */
export async function verifySession(): Promise<ReturnVerifySession> {
  const checkCache = existsSync(CACHE_FILE)

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: BROWSER_PATH
  })

  const page = await browser.newPage()

  await page.goto(FM_URL, {
    waitUntil: 'networkidle2'
  })

  try {
    const buttonLogin = await page.waitForSelector('xpath/.//a[contains(., "Log in")]', { timeout: 5000 })
      .catch(() => null)

    const loginLink = buttonLogin
      ? await page.evaluate(el => (el as HTMLAnchorElement).href, buttonLogin)
      : null;

    await browser.close();

    if (loginLink || !checkCache) {
      return {
        status: true,
        loginLink: loginLink
      };
    }

    return {
      status: false,
      loginLink: null
    };
  } catch (err) {
    await browser.close();
    throw new Error(`Error finding login button, <verifySession> : ${err}`)
  }
}

/**
 * Authenticates a user by launching a browser and guiding them through the login flow.
 * @param {string} url - The login URL to navigate to
 * @returns {Promise<boolean>} True if login was successful, false otherwise
 */
export async function login(url: string): Promise<boolean> {
  const TARGET_URL = `${FM_URL}/home`

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: BROWSER_PATH,
    userDataDir: DATA_DIR,
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--test-type',
      '--no-first-run',
      '--no-default-browser-check',
      '--password-store=basic',
      '--start-maximized',
      '--disable-blink-features=AutomationControlled',
    ],
  })

  const page = (await browser.pages())[0]

  try {
    if (!page) throw new Error('The authentication page could not be opened, <login>')

    await page.goto(url)

    const loginPromise = new Promise<boolean>((resolve) => {
      page.on("framenavigated", async (frame) => {
        const currentUrl = frame.url()

        if (currentUrl.includes(TARGET_URL)) {
          await new Promise(r => setTimeout(r, 1000))
          await browser.close()
          resolve(true)
        }
      })

      browser.on("disconnected", () => resolve(false))
    })

    await page.goto(url, { waitUntil: 'networkidle2' });

    await page.bringToFront();
    await page.evaluate(() => {
      const win = window as Window;
      const doc = document as Document;

      win.focus();
      (doc.body as HTMLElement).focus();
    });
    await page.mouse.click(0, 0);

    return await loginPromise
  } catch (err) {
    await browser.close()
    throw new Error(`Error logging in, <login> : ${err}`)
  }
}