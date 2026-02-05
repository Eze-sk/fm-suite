import { Box, Text } from 'ink'
import type { Difficulty, Languages, Plan, StatesChallenge } from '@typings/challengeData'

import PlanTag from './tags/Plan'
import LanguagesTag from './tags/Languages'
import DifficultyTag from './tags/Difficulty'
import { colors, theme } from '@/colorPalette'

interface Props {
  plan: Plan
  title: string
  languages: Languages[]
  difficulty: Difficulty
  status: StatesChallenge
  isFocused?: boolean
}

/**
 * Displays a challenge card with metadata tags including plan, title, supported languages, and difficulty level.
 * @component
 * @param {Props} props - Component props
 * @param {Plan} props.plan - Challenge plan type (free, free+, premium)
 * @param {string} props.title - Title of the challenge
 * @param {Languages[]} props.languages - Array of supported languages for the challenge
 * @param {Difficulty} props.difficulty - Difficulty level of the challenge
 * @param {boolean} [props.isFocused=false] - Whether the card is currently focused/selected
 * @returns {React.ReactNode} Challenge card display
 */
export default function ChallengeCardSearch({
  plan,
  title,
  languages,
  difficulty,
  status,
  isFocused = false,
}: Props): React.ReactNode {

  const Status = (): React.ReactNode => {
    if (status === "started") return <Text color={colors.cyan}>○</Text>
    if (status === "completed" || status === "new_start") return <Text color={colors.blue.default}>✔</Text>
    return <></>
  }

  return (
    <Box
      paddingX={1}
      paddingBottom={1}
      width={80}
      borderStyle="round"
      flexDirection="column"
      borderColor={isFocused ? theme.secondary : 'gray'}
    >
      <Box alignItems="center" justifyContent="space-between">
        <Box alignItems="center" gap={1}>
          <Status />
          <PlanTag plan={plan} />
          <Text bold>{title}</Text>
        </Box>
        <DifficultyTag level={difficulty} />
      </Box>
      <Box alignItems="center" gap={2}>
        {languages.map((l) => (
          <LanguagesTag language={l} key={l} />
        ))}
      </Box>
    </Box>
  )
}
