import { getChallenges } from "@lib/challenge.controller"
import type { ChallengeData } from "@typings/challengeData"
import type { ConfigFile } from "@typings/ConfigFile"
import { create } from "zustand"

export type AppStatus =
  | 'idle'
  | 'validating_session'
  | 'awaiting_permission'
  | 'logging_in'
  | 'verifying_data'
  | 'get_data'
  | 'scraping_data'
  | 'completed'
  | 'error'

export interface AppStore {
  appStatus: AppStatus
  data: ChallengeData | null
  config: ConfigFile
  setStatus: (status: AppStatus) => void
  setData: (data: ChallengeData | null) => void
  updateData: () => Promise<void>
  setConfig: (data: ConfigFile) => void
}

/**
 * Zustand store for managing application state and challenge data.
 * Provides status, data, and update methods for the app.
 */
export const useAppStore = create<AppStore>((set) => ({
  appStatus: "idle",
  data: null,
  config: {
    challengePath: process.cwd()
  },
  setStatus: (status): void => set({ appStatus: status }),
  setData: (data): void => set({ data }),
  updateData: async (): Promise<void> => {
    try {
      const response = await getChallenges()
      set({ data: response })
    } catch (err) {
      throw new Error(`Error updating challenge data: ${err}`)
    }
  },
  setConfig: (data): void => set({ config: data })
}))