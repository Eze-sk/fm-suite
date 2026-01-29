import { Box, Text } from 'ink'
import type { Difficulty } from '@typings/challengeData'

import { colors } from '@/colorPalette'

interface Props {
  level: Difficulty | undefined
  showNumber?: boolean
}

/**
 * Displays a difficulty level tag with color-coded styling.
 * Difficulty levels are: newbie (cyan), junior (emerald), intermediate (amber), advanced (orange), guru (pink).
 * @component
 * @param {Props} props - Component props
 * @param {Difficulty} props.level - Difficulty level to display
 * @param {boolean} [props.showNumber=false] - Whether to show the numeric difficulty level (1-5)
 * @returns {React.ReactNode} Difficulty level tag
 */
export default function DifficultyTag({
  level,
  showNumber = false,
}: Props): React.ReactNode {
  let color
  let number

  if (level === 'newbie') {
    color = colors.cyan
    number = 1
  } else if (level === 'junior') {
    color = colors.emerald
    number = 2
  } else if (level === 'intermediate') {
    color = colors.amber
    number = 3
  } else if (level === 'advanced') {
    color = colors.orange
    number = 4
  } else if (level === 'guru') {
    color = colors.pink
    number = 5
  }

  return (
    <Box borderStyle="round" borderColor={color} paddingX={2}>
      {showNumber && (
        <Box borderRight borderStyle="single" borderColor={color}>
          <Text>{number}</Text>
        </Box>
      )}
      <Text color={color}>{level?.toUpperCase()}</Text>
    </Box>
  )
}
