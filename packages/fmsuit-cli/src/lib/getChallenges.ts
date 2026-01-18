import { CACHE_FILE } from "../consts/env";
import type { ChallengeData } from "../typings/challengeData";
import { getValidCache } from "../utils/getValidCache";
import { scraping } from "./scraping";

/**
 * Retrieves challenge data from cache or by scraping the Frontend Mentor website.
 * @returns {Promise<ChallengeData>} An object containing challenge data
 */
export async function getChallenges(): Promise<ChallengeData> {
  const cacheChallenges = await getValidCache(CACHE_FILE)

  if (!cacheChallenges) {
    return await scraping()
  }

  const cacheFile = Bun.file(CACHE_FILE)
  return await cacheFile.json()
}