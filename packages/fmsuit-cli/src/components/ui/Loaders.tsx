import { useEffect, useState } from 'react';

import { Box, Text } from 'ink';

import { theme } from '@/colorPalette';

import CenterElement from './Center';

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

interface Props {
  message: string
  isCentered?: boolean
}

/**
 * Displays a loading card with animated loader and centered text content.
 * @component
 * @param {Props} props - Component props
 * @param {string} props.message - Loading message to display
 * @param {boolean} props.isCentered - Whether to center the content (default: true)
 * @returns {React.ReactNode} Loading card UI
 */
export function LoaderCard({ message, isCentered = true }: Props): React.ReactNode {
  const messageUpperCase = message.toUpperCase()

  return (
    <>
      {isCentered ? (
        <CenterElement gap={2} flexDirection="column">
          <LoadingAnimation />
          <Text> {messageUpperCase}</Text>
        </CenterElement>
      ) : (
        <Box gap={2} flexDirection="column" alignItems="center">
          <LoadingAnimation />
          <Text> {messageUpperCase}</Text>
        </Box>
      )}
    </>
  )
}
