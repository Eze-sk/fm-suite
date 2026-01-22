import { Box, Text } from 'ink';
import type { Difficulty, Languages, Plan } from '@typings/challengeData';

import PlanTag from './tags/Plan';
import LanguagesTag from './tags/Languages';
import DifficultyTag from './tags/Difficulty';

interface Props {
  plan: Plan
  title: string
  languages: Languages[]
  difficulty: Difficulty
}

/**
 * Displays a challenge card with metadata tags including plan, title, supported languages, and difficulty level.
 * @component
 * @param {Props} props - Component props
 * @param {Plan} props.plan - Challenge plan type (free, free+, premium)
 * @param {string} props.title - Title of the challenge
 * @param {Languages[]} props.languages - Array of supported languages for the challenge
 * @param {Difficulty} props.difficulty - Difficulty level of the challenge
 * @returns {React.ReactNode} Challenge card display
 */
export default function ChallengeCardSearch({
  plan,
  title,
  languages,
  difficulty,
}: Props): React.ReactNode {

  return (
    <Box
      paddingX={1}
      paddingBottom={1}
      width={80}
      borderStyle="round"
      flexDirection="column"
      borderColor="gray"
    >
      <Box alignItems="center" justifyContent="space-between">
        <Box alignItems="center" gap={1}>
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
