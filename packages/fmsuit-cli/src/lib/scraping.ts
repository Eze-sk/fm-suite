import { add } from 'date-fns'
import { CACHE_FILE, BROWSER_PATH, FM_URL } from '../consts/env'
import puppeteer from 'puppeteer-core'
import type { ChallengeScrap, ChallengeData } from '../typings/challengeData'

/**
 * Scrapes challenge data from the Frontend Mentor website and caches the results.
 * @returns {Promise<ChallengeData>} An object containing the scraped challenge data and cache expiration
 */
export async function scraping(): Promise<ChallengeData> {
  const challengeCache = Bun.file(CACHE_FILE)

  const browser = await puppeteer.launch({
    headless: true,
    executablePath: BROWSER_PATH,
  })

  const page = await browser.newPage()

  await page.goto(`${FM_URL}/challenges`, {
    waitUntil: 'networkidle2',
    timeout: 60000,
  })

  try {
    await page.waitForSelector('main ul')

    const challengeScrap = await page.evaluate<ChallengeScrap[]>(() => {
      const items = Array.from(document.querySelectorAll('li.isolate'))

      return items.map((c, i) => {
        const plan =
          (
            c.querySelector('span[class*="tracking-wider"]') as HTMLElement
          )?.innerText.trim() || 'Premium'

        const difficultyElement = c.querySelector(
          'div[class*="w-min"] span:last-child',
        ) as HTMLElement
        const difficulty =
          difficultyElement?.innerText.trim() || 'No difficulty'

        const tags = Array.from(c.querySelectorAll('ul li'))
        const languages = tags.map((t) => (t as HTMLElement).innerText.trim())

        const isNew = c.querySelector('span')?.innerText.trim().includes('new')
        const title =
          (c.querySelector('h2') as HTMLElement)?.innerText.trim() || 'Untitled'
        const description =
          (c.querySelector('p') as HTMLElement)?.innerText.trim() ||
          'No description'
        const downloadLink =
          (c.querySelector('a') as HTMLAnchorElement)?.href || ''

        return {
          id: i,
          plan: plan.toLocaleLowerCase(),
          difficulty: difficulty.toLocaleLowerCase(),
          languages,
          status: 'pending',
          isNew,
          title,
          description,
          downloadLink,
        }
      })
    })

    let finalData = challengeScrap as ChallengeScrap[]

    if (await challengeCache.exists()) {
      const oldContent = await challengeCache.json()
      const oldData: ChallengeScrap[] = oldContent.challenges || []

      const dataMap = new Map()

      oldData.forEach((item: ChallengeScrap) => dataMap.set(item.id, item))

      finalData.forEach((item) => {
        const existingItem = dataMap.get(item.id)

        dataMap.set(item.id, {
          ...existingItem,
          ...item,
          updated_at: new Date(),
        })
      })

      finalData = Array.from(dataMap.values())
    }

    const challengeData: ChallengeData = {
      expires_in: add(new Date(), {
        days: 7,
      }),
      last_updated: new Date(),
      challenges: finalData,
    }

    await Bun.write(CACHE_FILE, JSON.stringify(challengeData, null, 2))
    await browser.close()
    return challengeData
  } catch (err) {
    await browser.close()
    throw new Error(
      `Error to the scraper, the mentor frontend challenge, <scraping> : ${err}`,
    )
  }
}
