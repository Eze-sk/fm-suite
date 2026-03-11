import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import {
  BROWSER_PATH,
  CHALLENGES_FILES_DIR,
  DATA_DIR,
  SESSION_FILE,
} from '@consts/env'
import { waitForFile } from '@utils/waitForFile'
import { extractZip } from '@utils/extractZip'
import { basename } from 'node:path'
import { updateChallenge } from './challenge.controller'

export interface DlChallengeReturn {
  cachePath: string
  cacheName: string
}

interface dlChallenge {
  downloadUrl: string
  idChallenge: number
}

/**
 * Downloads a challenge from Frontend Mentor using a headless browser, extracts the zip file,
 * and updates the challenge cache information in the database.
 * @param {dlChallenge} options - Configuration object
 * @param {string} options.downloadUrl - The URL to download the challenge from
 * @param {number} options.idChallenge - The challenge ID for database updates
 * @returns {Promise<DlChallengeReturn>} Object containing cache path and cache name
 * @throws {Error} If download fails or required elements are not found
 */
export async function downloadChallenge({
  downloadUrl,
  idChallenge,
}: dlChallenge): Promise<DlChallengeReturn> {
  if (!fs.existsSync(CHALLENGES_FILES_DIR)) {
    fs.mkdirSync(CHALLENGES_FILES_DIR, { recursive: true })
  }

  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: true,
    userDataDir: DATA_DIR,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const sessionExists = await Bun.file(SESSION_FILE).exists()
    const page = await browser.newPage()

    const client = await page.createCDPSession()
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: CHALLENGES_FILES_DIR,
    })

    if (sessionExists) {
      const sessionData = await Bun.file(SESSION_FILE).json()

      await browser.setCookie({
        name: sessionData.name,
        value: sessionData.value,
        domain: '.frontendmentor.io',
        path: '/',
        httpOnly: true,
        secure: true,
      })
    }

    await page.goto(downloadUrl, { waitUntil: 'networkidle2' })

    const startBtnSelector =
      'xpath/.//button[contains(text(), "Start challenge")]'
    const downloadBtnSelector =
      'xpath/.//button[contains(text(), "Download starter")]'

    const startButton = await page
      .waitForSelector(startBtnSelector, { timeout: 5000 })
      .catch(() => null)

    if (startButton) {
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(() => null),
        startButton.click(),
      ])
    }

    const downloadButton = await page.waitForSelector(downloadBtnSelector, {
      visible: true,
      timeout: 15000,
    })

    if (!downloadButton) {
      throw new Error('Download button not found')
    }

    await downloadButton?.click()

    const pathZip = await waitForFile({
      dir: CHALLENGES_FILES_DIR,
      timeoutMs: 60000,
    })

    await extractZip({
      zipPath: pathZip ?? '',
      targetDir: CHALLENGES_FILES_DIR,
    })

    const cacheName = basename(pathZip ?? '').replace('-main.zip', '')
    const cachePath = pathZip?.replace('.zip', '') ?? ''

    await updateChallenge({
      id: idChallenge,
      key: 'challengeCacheName',
      value: cacheName,
    })

    await updateChallenge({
      id: idChallenge,
      key: 'challengeCachePath',
      value: cachePath,
    })

    return {
      cacheName,
      cachePath,
    }
  } catch (err) {
    throw new Error(
      `Error to the download the challenge, <downloadManager> : ${err}`,
    )
  } finally {
    const pages = await browser.pages()
    await Promise.all(pages.map((page) => page.close()))
    await browser.close()
  }
}
