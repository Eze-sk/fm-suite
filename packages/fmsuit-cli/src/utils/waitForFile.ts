import fs from 'node:fs'
import path from 'node:path'

interface WaitForFileTypes {
  dir: string
  timeoutMs?: number
}

/**
 * Waits for a new file to be added to a directory, ignoring temporary file extensions.
 * Useful for detecting when downloads are complete.
 * @param {WaitForFileTypes} options - Configuration object
 * @param {string} options.dir - The directory path to monitor
 * @param {number} [options.timeoutMs=30000] - Maximum time to wait in milliseconds
 * @returns {Promise<string | undefined>} The full path to the detected file, or undefined if timeout
 * @throws {Error} Throws an error if the timeout is exceeded without finding a file
 */
export async function waitForFile({
  dir,
  timeoutMs = 30000,
}: WaitForFileTypes): Promise<string | undefined> {
  const start = Date.now()
  const before = new Set(fs.readdirSync(dir))

  while (Date.now() - start < timeoutMs) {
    const files = fs.readdirSync(dir)
    const added = files.filter((f) => !before.has(f))

    const ready = added.find(
      (f) =>
        !f.endsWith('.crdownload') &&
        !f.endsWith('.tmp') &&
        !f.endsWith('.part'),
    )

    if (ready) {
      await new Promise((r) => setTimeout(r, 500))
      return path.join(dir, ready)
    }

    await new Promise((r) => setTimeout(r, 500))
  }

  throw new Error('Download timed out')
}
