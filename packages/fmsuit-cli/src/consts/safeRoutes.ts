import { homedir } from "node:os";
import { join } from "node:path";

export const DATA_DIR = join(homedir(), '.fmsuit-cli-sessions');
export const CACHE_FILE = join(DATA_DIR, 'data_cache.json');
export const USER_DATA_DIR = join(DATA_DIR, 'browser_session');