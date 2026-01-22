import { Text } from 'ink';
import type { Languages } from '@typings/challengeData';

import { colors } from '@/colorPalette';

interface Props {
  language: Languages
}

/**
 * Displays a language tag with color-coded styling.
 * Supported languages: HTML (cyan), CSS (blue), JS (pink), API (rose).
 * @component
 * @param {Props} props - Component props
 * @param {Languages} props.language - Programming language to display
 * @returns {React.ReactNode} Language tag
 */
export default function LanguagesTag({ language }: Props): React.ReactNode {
  let color

  if (language === 'HTML') {
    color = colors.cyan
  } else if (language === 'CSS') {
    color = colors.blue.default
  } else if (language === 'JS') {
    color = colors.pink
  } else if (language === 'API') {
    color = colors.rose
  } else {
    color = colors.cyan
  }

  return (
    <Text color={color}>
      {language}
    </Text>
  )
}
