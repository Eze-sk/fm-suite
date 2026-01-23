import { useEffect } from 'react';

import { render } from 'ink';
import AlertAuth from '@components/ui/AlertAuth';
import { LoaderCard } from '@components/ui/Loaders';
import MainSection from '@components/challenges/MainSection';
import { useInitialization, type Status } from '@hooks/useInitialization';

/**
 * Root component of the CLI application.
 * * Manages the global initialization lifecycle, including session validation,
 * user permissions, and the transition between loading states and the main UI.
 * * @component
 * @returns {React.ReactNode} The rendered CLI view based on the current initialization status.
 * * @example
 * // The app starts in 'idle', clears the console, 
 * // and checks for an active session before showing the MainSection.
 * render(<App />);
 */
function App(): React.ReactNode {
  const { data, status, setPermission } = useInitialization()

  const MAIN_UI_STATUS: Status[] = ["verifying_data", "get_data", "scraping_data", "completed"]
  const isMainUiReady = MAIN_UI_STATUS.includes(status)

  useEffect(() => {
    console.clear()
  }, [])

  return (
    <>
      {status === "idle" && <LoaderCard message="Initializing CLI environment..." />}
      {status === "validating_session" && <LoaderCard message="Authenticating session..." />}
      {status === "awaiting_permission" && <AlertAuth onConfirm={setPermission} />}
      {status === "logging_in" && <LoaderCard message="Awaiting browser authentication..." />}
      {isMainUiReady && <MainSection challenge={data} appStep={status} />}
    </>
  )
}

render(<App />)
