import { Box } from 'ink'
import { MemoizedLogo } from '@components/ui/Logo'
import { SearchInput } from '@components/ui/TextInput'

import SearchSection from './SearchSection'
import { useEffect, useState } from 'react'
import type { Status } from '@hooks/useInitialization'
import type { ChallengeData, ChallengeScrap } from '@typings/challengeData'

type ViewStatus = 'LOGO' | 'SEARCHER' | 'CHALLENGE'

interface Props {
  appStep: Status
  challenge: ChallengeData | null
}

export default function MainSection({
  challenge,
  appStep,
}: Props): React.ReactNode {
  const [view, setView] = useState<ViewStatus>('LOGO')
  const [query, setQuery] = useState('')
  const [deferredQuery, setDeferredQuery] = useState('')
  const [selectChallenge, setSelectChallenge] =
    useState<ChallengeScrap | null>()

  useEffect(() => {
    const handler = setTimeout(() => {
      setDeferredQuery(query)
    }, 50)

    return (): void => clearTimeout(handler)
  }, [query])

  const handleSearch = (e: string): void => {
    setQuery(e)

    if (e !== '') setView('SEARCHER')
    else setView('LOGO')
  }

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-end"
      height={28}
    >
      {view === 'LOGO' && (
        <Box marginLeft={4} marginBottom={3}>
          <MemoizedLogo />
        </Box>
      )}
      {view === 'SEARCHER' && (
        <SearchSection
          data={challenge}
          query={deferredQuery}
          status={appStep}
          onSelectResult={setSelectChallenge}
        />
      )}
      {view === 'CHALLENGE' && <Box></Box>}
      <SearchInput onChange={(e) => handleSearch(e)} />
    </Box>
  )
}
