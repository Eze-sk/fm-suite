import type { ChallengeScrap } from '@typings/challengeData'
import { Box, Text, useInput } from 'ink'
import PlanTag from './tags/Plan'
import LanguagesTag from './tags/Languages'
import DifficultyTag from './tags/Difficulty'

import FocusElement from '@components/ui/FocusElement'
import Select from '@components/ui/Select'
import { colors } from '@/colorPalette'
import { technologies } from '@/config/questions'
import { useState } from 'react'
import { useNavigationContext } from '@/contexts/useNavigation'
import open from 'open'

interface Props {
  challengeData: ChallengeScrap | undefined
}

export default function ChallengeSection({
  challengeData,
}: Props): React.ReactNode {
  const [isInit, setIsInit] = useState(true)

  const { setFocus } = useNavigationContext()

  const action = (): void => {
    setIsInit(!isInit)
    setFocus('technologies')
  }

  useInput((input, key) => {
    if (key.ctrl && input === 'o') {
      open(challengeData?.downloadLink ?? '')
    }
  })

  return (
    <Box width={80} flexDirection="column">
      <Box flexDirection="column" marginBottom={1}>
        <Box
          justifyContent="space-between"
          alignItems="center"
          marginBottom={2}
        >
          <Box gap={2}>
            <PlanTag plan={challengeData?.plan} />
            {challengeData?.languages.map((l) => (
              <LanguagesTag language={l} key={l} />
            ))}
          </Box>
          <DifficultyTag level={challengeData?.difficulty} />
        </Box>
        <Box gap={1} flexDirection="column">
          <Text>{challengeData?.title.toUpperCase()}</Text>
          <Text>{challengeData?.description}</Text>
        </Box>
      </Box>
      <Box height={20} marginTop={1} gap={1} flexDirection="column">
        <FocusElement
          id="start-challenge"
          onAction={action}
          addMark={false}
          hasBorder
          width={25}
          justifyContent="center"
          placeholder={false}
          color={isInit ? colors.rose : colors.blue.light}
        >
          <FocusElement.Text
            italic
            label={isInit ? 'Start challenge' : 'challenge initiated'}
          />
        </FocusElement>
        <Select
          isDisabled={isInit}
          placeholder={
            isInit
              ? 'You must start a challenge to choose a technology'
              : '(Press Enter)'
          }
          {...technologies}
        />
      </Box>
      <Box marginLeft={1}>
        <Text color="gray" italic>
          <Text bold>ctrl + O</Text> to open the challenge in your browser
        </Text>
      </Box>
    </Box>
  )
}
