import { join } from 'node:path'
import { homedir } from 'node:os'
import defaultBrowser from 'default-browser'
import {
  findChromiumBasedBrowser,
  type Browser,
} from '@utils/findChromiumBasedBrowser'

export const DATA_DIR = join(homedir(), '.fmsuit-cli')
export const CACHE_FILE = join(DATA_DIR, 'challenge_cache.json')
export const SESSION_FILE = join(DATA_DIR, 'fm-session.json')
export const CHALLENGES_FILES_DIR = join(DATA_DIR, 'challenges_files')

const browser = await defaultBrowser()
export const BROWSER_PATH = findChromiumBasedBrowser(browser.name as Browser)

export const FM_URL = 'https://www.frontendmentor.io'

export const CONFIG_FILE_NAME = "fm-cli"