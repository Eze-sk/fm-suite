import { CACHE_FILE } from '@consts/env'
import { getValidCache } from '@utils/getValidCache'
import type { ChallengeData, ChallengeScrap } from '@typings/challengeData'

import { scraping } from './scraping'
import type { AppStatus } from '@/stores/useApp'

interface getChallengesTypes {
  status?: (status: AppStatus) => void
}

/**
 * Retrieves challenge data from cache or by scraping the Frontend Mentor website.
 * @param {object} [props] - Function parameters
 * @param {(status: AppStatus) => void} [props.status] - Callback for updating the current operation status.
 * @returns {Promise<ChallengeData>} An object containing challenge data.
 */
export async function getChallenges({ status }: getChallengesTypes = {}): Promise<ChallengeData> {
  const cacheChallenges = await getValidCache(CACHE_FILE)

  if (!cacheChallenges) {
    status?.('scraping_data')
    return await scraping()
  }

  const cacheFile = Bun.file(CACHE_FILE)
  return await cacheFile.json()
}

interface updateChallengeTypes<K extends keyof ChallengeScrap = keyof ChallengeScrap> {
  id: number
  key: K
  value: ChallengeScrap[K]
}

/**
 * Updates a specific challenge in the cache file.
 * @param {object} props - Function parameters.
 * @param {number} props.id - The ID of the challenge to update.
 * @param {K} props.key - The key of the property to update in the challenge.
 * @param {ChallengeScrap[K]} props.value - The new value for the specified property.
 * @returns {Promise<void>} A Promise that resolves when the challenge is updated.
 */
export async function updateChallenge<K extends keyof ChallengeScrap>({ id, key, value }: updateChallengeTypes<K>): Promise<void> {
  const cacheFile = Bun.file(CACHE_FILE)

  if (!(await cacheFile.exists())) {
    console.error("The cache file does not exist.");
    return;
  }

  const data = await cacheFile.json() as ChallengeData
  const index = data.challenges.findIndex(c => c.id === id)

  const challenge = data.challenges[index];

  if (challenge) {
    challenge[key] = value;

    challenge.updated_at = new Date();
    data.last_updated = new Date();

    await Bun.write(CACHE_FILE, JSON.stringify(data, null, 2))
  } else {
    console.warn(`ID ${id} not found.`);
  }
}