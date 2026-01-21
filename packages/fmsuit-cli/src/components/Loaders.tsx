import { useEffect, useState } from 'react';

import { Box, Text } from 'ink';

import { theme } from '@/colorPalette';

import CenterElement from './Center';

interface Props {
  content: string
}

/**
 * Displays an animated loading indicator with three blinking squares.
 * The animation cycles through the squares with a 300ms interval.
 * @component
 * @returns {React.ReactNode} Animated loading indicator
 */
export function LoadingAnimation(): React.ReactNode {
  const [activeStep, setActiveStep] = useState(0)
  const dots = Array(3).fill('⬛')

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % dots.length)
    }, 300)

    return (): void => clearInterval(timer)
  }, [dots.length])

  return (
    <Box gap={2}>
      {dots.map((dot, i) => (
        <Text
          key={i}
          color={i === activeStep ? theme.success : theme.secondary}
        >
          {dot}
        </Text>
      ))}
    </Box>
  )
}

/**
 * Displays a loading card with animated loader and centered text content.
 * @component
 * @param {Props} props - Component props
 * @param {string} props.content - Text content to display below the loader animation
 * @returns {React.ReactNode} Loading card UI
 */
export function LoaderCard({ content }: Props): React.ReactNode {
  return (
    <CenterElement gap={1} flexDirection="column">
      <LoadingAnimation />
      <Text> {content.toLocaleUpperCase()}</Text>
    </CenterElement>
  )
}
