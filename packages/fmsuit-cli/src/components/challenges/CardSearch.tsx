import { useId } from 'react';

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
  const idElement = useId()

  return (
    <Box
      paddingX={2}
      width={80}
      borderStyle="round"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box gap={2} alignItems="center">
        <PlanTag plan={plan} />
        <Text bold>{title}</Text>
      </Box>
      <Box gap={2} alignItems="center">
        {languages.map((l) => (
          <LanguagesTag language={l} key={idElement} />
        ))}
        <DifficultyTag level={difficulty} />
      </Box>
    </Box>
  )
}
