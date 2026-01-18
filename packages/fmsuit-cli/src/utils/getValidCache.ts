import { isAfter } from "date-fns";

type Data = {
  name?: string
  expires_in: number
}

/**
 * Validates if a cached file exists and has not expired.
 * @param {string} path - The file path to the cache file
 * @returns {Promise<boolean>} True if the cache file exists and is still valid, false otherwise
 */
export async function getValidCache(path: string): Promise<boolean> {
  const file = Bun.file(path)
  if (!(await file.exists())) return false

  try {
    const data = await file.json() as Data
    let expiryDate = new Date(data.expires_in)

    if (data?.name) {
      expiryDate = new Date(data.expires_in * 1000)
    }

    return isAfter(expiryDate, new Date())
  } catch (err) {
    throw new Error(`Error validating local cache, <getValidCache> : ${err}`)
  }
}