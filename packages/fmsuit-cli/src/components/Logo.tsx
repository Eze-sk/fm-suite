import { Box, Text } from 'ink';

import ascii from '@/ASCIILogo.json' with { type: 'json' }
import { colors } from '@/colorPalette';

/**
 * Renders the FM Suite CLI logo with ASCII art and branding.
 * Displays the FM Suite branding, CLI label, author attribution, and decorative elements.
 * @component
 * @returns {React.ReactNode} Logo display
 */
export default function Logo(): React.ReactNode {
  const formatAscii = (lines: string[]): string => lines.join('\n')

  return (
    <Box flexDirection="column">
      <Box>
        <Text>{formatAscii(ascii.fmsuit)}</Text>
        <Text>{formatAscii(ascii.hyphen)}</Text>
        <Text color={colors.cyan}>{formatAscii(ascii.cli)}</Text>
        <Text color={colors.blue.default}>By eze-sk</Text>
      </Box>
      <Text color="#F9C7C5">{formatAscii(ascii.circumflex)}</Text>
    </Box>
  )
}
