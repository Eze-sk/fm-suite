import { useEffect, useCallback, useRef } from 'react'

import { SESSION_FILE } from '@consts/env'
import { waitUntil } from '@utils/waitUntil'
import { verifySession, login } from '@lib/auth'
import { getChallenges } from '@lib/challenge.controller'
import { getValidCache } from '@utils/getValidCache'
import type { ChallengeData } from '@typings/challengeData'
import { useAppStore, type AppStatus } from '@/stores/useApp'
import { useShallow } from 'zustand/shallow'

/**
 * React hook that manages the initialization sequence for the application.
 * Handles session validation, login, and challenge data retrieval.
 * @returns {Object} An object containing the current status, permission setter, and challenge data
 * @returns {Status} status - The current state of the initialization process
 * @returns {Function} setPermission - Function to set user permission for login
 * @returns {ChallengeData|null} data - The retrieved challenge data or null if not yet loaded
 */
export function useInitialization(): {
  appStatus: AppStatus
  setPermission: (value: boolean) => void
  data: ChallengeData | null
} {
  const { appStatus, data, setData, setStatus } = useAppStore(
    useShallow((state) => ({
      appStatus: state.appStatus,
      data: state.data,
      setStatus: state.setStatus,
      setData: state.setData
    }))
  )

  const permissionRef = useRef(false)

  const setPermission = (val: boolean): void => {
    permissionRef.current = val
  }

  const runInitSequence = useCallback(async (): Promise<void> => {
    try {
      setStatus('validating_session')
      const hasCache = await getValidCache(SESSION_FILE)

      let sessionStatus = hasCache
      let loginLink = null

      if (!hasCache) {
        const session = await verifySession()
        sessionStatus = session.status
        loginLink = session.loginLink
      }

      if (!sessionStatus) {
        setStatus('awaiting_permission')

        await waitUntil(() => permissionRef.current)

        setStatus('logging_in')
        const loginSuccessful = await login(loginLink ?? '')

        if (!loginSuccessful) {
          setStatus('error')
          throw new Error('LOGIN_FAILED')
        }
      }

      setStatus('verifying_data')

      const challengeData = await getChallenges({ status: setStatus })
      setData(challengeData)

      setStatus('completed')
    } catch (err) {
      setStatus('error')
      throw new Error(`INITIALIZATION_FAILED ${err}`)
    } finally {
      setStatus('completed')
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const start = async (): Promise<void> => {
      if (isMounted) await runInitSequence()
    }

    start()

    return (): void => {
      isMounted = false
    }
  }, [runInitSequence])

  return { appStatus, setPermission, data }
}
