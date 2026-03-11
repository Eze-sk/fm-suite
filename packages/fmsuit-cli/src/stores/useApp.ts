import { getChallenges } from '@lib/challenge.controller'
import type { ChallengeData } from '@typings/challengeData'
import type { ConfigFile } from '@typings/ConfigFile'
import { create } from 'zustand'

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

export type DownloadStepStatus = 'pending' | 'loading' | 'completed'

export interface DownloadStep {
  id: string
  label: string
  status: DownloadStepStatus
}

export interface AppStore {
  appStatus: AppStatus
  downloadStep: DownloadStep[]
  data: ChallengeData | null
  config: ConfigFile
  setStatus: (status: AppStatus) => void
  updateDownloadStep: (id: string, status: DownloadStepStatus) => void
  setData: (data: ChallengeData | null) => void
  updateData: () => Promise<void>
  setConfig: (data: ConfigFile) => void
}

/**
 * Zustand store for managing application state and challenge data.
 * Provides status, data, and update methods for the app.
 */
export const useAppStore = create<AppStore>((set) => ({
  appStatus: 'idle',
  downloadStep: [
    { id: 'DOWNLOAD', label: 'Download challenge', status: 'pending' },
    { id: 'BUILD', label: 'Starting the challenge', status: 'pending' },
    { id: 'MERGE', label: 'Merge resource', status: 'pending' },
  ],
  data: null,
  config: {
    challengePath: process.cwd(),
  },
  setStatus: (status): void => set({ appStatus: status }),
  updateDownloadStep: (id, status): void => {
    set((state) => ({
      downloadStep: state.downloadStep.map((s) =>
        s.id === id ? { ...s, status } : s,
      ),
    }))
  },
  setData: (data): void => set({ data }),
  updateData: async (): Promise<void> => {
    try {
      const response = await getChallenges()
      set({ data: response })
    } catch (err) {
      throw new Error(`Error updating challenge data: ${err}`)
    }
  },
  setConfig: (data): void => set({ config: data }),
}))
