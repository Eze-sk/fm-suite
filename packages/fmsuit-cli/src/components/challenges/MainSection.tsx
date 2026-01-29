import { Box } from 'ink'
import { MemoizedLogo } from '@components/ui/Logo'
import { SearchInput } from '@components/ui/TextInput'

import SearchSection from './SearchSection'
import { useEffect, useState } from 'react'
import type { Status } from '@hooks/useInitialization'
import type { ChallengeData, ChallengeScrap } from '@typings/challengeData'
import ChallengeSection from './ChallengeSection'

type ViewStatus = 'LOGO' | 'SEARCHER' | 'CHALLENGE'

interface Props {
  appStep: Status
  challenge: ChallengeData | null
}

export default function MainSection({
  challenge,
  appStep,
}: Props): React.ReactNode {
  const [selectedChallenge, setSelectedChallenge] = useState<
    ChallengeScrap | undefined
  >()
  const [view, setView] = useState<ViewStatus>(
    selectedChallenge ? 'CHALLENGE' : 'LOGO',
  )

  const [query, setQuery] = useState('')
  const [deferredQuery, setDeferredQuery] = useState('')
  const [sectionHeight, setSectionHeight] = useState(30)
  const [visibleResults, setVisibleResults] = useState(3)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDeferredQuery(query)
    }, 40)

    return (): void => clearTimeout(handler)
  }, [query])

  const handleSearch = (e: string): void => {
    setQuery(e)

    if (e !== '') {
      setView('SEARCHER')
    } else {
      if (selectedChallenge) {
        setView('CHALLENGE')
      } else {
        setView('LOGO')
      }
    }
  }

  const handleSelectResult = (data: ChallengeScrap | undefined): void => {
    setSelectedChallenge(data)
    setSectionHeight(43)
    setVisibleResults(5)
    setView('CHALLENGE')
  }

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-end"
      height={sectionHeight}
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
          onSelectResult={handleSelectResult}
          visibleItems={visibleResults}
        />
      )}
      {view === 'CHALLENGE' && (
        <ChallengeSection challengeData={selectedChallenge} />
      )}
      <SearchInput onChange={(e) => handleSearch(e)} />
    </Box>
  )
}
