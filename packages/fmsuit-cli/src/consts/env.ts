import { homedir } from "node:os";
import { join } from "node:path";
import defaultBrowser from "default-browser";
import { findChromiumBasedBrowser, type Browser } from "../utils/findChromiumBasedBrowser";

export const DATA_DIR = join(homedir(), '.fmsuit-cli-sessions');
export const CACHE_FILE = join(DATA_DIR, 'challenge_cache.json');
export const SESSION_FILE = join(DATA_DIR, 'fm-session.json');

const browser = await defaultBrowser()
export const BROWSER_PATH = findChromiumBasedBrowser(browser.name as Browser)

export const FM_URL = "https://www.frontendmentor.io"