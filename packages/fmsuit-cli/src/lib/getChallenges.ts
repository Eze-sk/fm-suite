import { CACHE_FILE } from '../consts/env'
import type { ChallengeData } from '../typings/challengeData'
import { getValidCache } from '../utils/getValidCache'
import { scraping } from './scraping'
import type { Dispatch, SetStateAction } from 'react'
import type { Status } from '../hooks/useInitialization'

interface Props {
  status: Dispatch<SetStateAction<Status>>
}

/**
 * Retrieves challenge data from cache or by scraping the Frontend Mentor website.
 * @param {Props} props - Function parameters
 * @param {Dispatch<SetStateAction<Status>>} props.status - State setter for updating the current operation status
 * @returns {Promise<ChallengeData>} An object containing challenge data
 */
export async function getChallenges({ status }: Props): Promise<ChallengeData> {
  const cacheChallenges = await getValidCache(CACHE_FILE)

  if (!cacheChallenges) {
    status('scraping_data')
    return await scraping()
  }

  const cacheFile = Bun.file(CACHE_FILE)
  return await cacheFile.json()
}
