import { Box, Text } from 'ink'
import type { Plan } from '@typings/challengeData'

import { colors } from '@/colorPalette'

interface Props {
  plan: Plan
}

/**
 * Displays a subscription plan tag with color-coded background styling.
 * Plan types: free (light blue), free+ (orange), premium (blue).
 * @component
 * @param {Props} props - Component props
 * @param {Plan} props.plan - Subscription plan type to display
 * @returns {React.ReactNode} Plan tag
 */
export default function PlanTag({ plan }: Props): React.ReactNode {
  let bgColor
  let textColor = 'white'

  if (plan === 'free') {
    bgColor = colors.blue.light
    textColor = colors.blue.default
  } else if (plan === 'free+') {
    bgColor = colors.orange
  } else if (plan === 'premium') {
    bgColor = colors.blue.default
  }

  return (
    <Box backgroundColor={bgColor} paddingX={1}>
      <Text color={textColor} bold>
        {plan.toUpperCase()}
      </Text>
    </Box>
  )
}
