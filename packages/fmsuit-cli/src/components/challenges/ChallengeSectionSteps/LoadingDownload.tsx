import { colors } from '@/colorPalette'
import SnakeLoader from '@components/ui/SnakeLoader'
import { Box, Text } from 'ink'
import { useEffect, useRef } from 'react'
import type { StepSection } from '../ChallengeSection'
import { useAppStore, type DownloadStep } from '@/stores/useApp'
import { updateChallenge } from '@lib/challenge.controller'
import type { ChallengeScrap } from '@typings/challengeData'

/**
 * Props for the LoadingDownloadSteps component.
 * @interface LoadStepsType
 * @property {ChallengeScrap | undefined} data - The challenge data.
 * @property {React.Dispatch<React.SetStateAction<StepSection>>} nextStep - Function to navigate to the next step.
 */
interface LoadStepsType {
  data: ChallengeScrap | undefined
  nextStep: React.Dispatch<React.SetStateAction<StepSection>>
}

/**
 * Component for displaying the download and merge status of a challenge.
 * @param {LoadStepsType} { nextStep, data } - The props for the component.
 * @returns {React.ReactNode} The LoadingDownloadSteps component.
 */
export default function LoadingDownloadSteps({
  nextStep,
  data,
}: LoadStepsType): React.ReactNode {
  const steps = useAppStore((state) => state.downloadStep)
  const updateData = useAppStore((state) => state.updateData)

  const hasCompletedRef = useRef(false)

  useEffect(() => {
    const mergeStep = steps.find((step) => step.id === 'MERGE')

    const handleCompleted = async (): Promise<void> => {
      if (
        mergeStep &&
        mergeStep.status === 'completed' &&
        !hasCompletedRef.current
      ) {
        await updateChallenge({
          id: data?.id ?? 0,
          key: 'status',
          value: 'completed',
        })

        await updateData()

        nextStep('start')

        hasCompletedRef.current = true
      }
    }

    handleCompleted()
  }, [steps])

  const handleStep = (stepValue: DownloadStep): React.ReactNode => {
    const definedStep = {
      icon: '◌',
      color: 'gray',
    }

    if (stepValue.status === 'loading') {
      definedStep.color = colors.cyan
      definedStep.icon = '○'
    } else if (stepValue.status === 'completed') {
      definedStep.color = colors.blue.default
      definedStep.icon = '◉'
    }

    return (
      <Text color={definedStep.color}>
        {definedStep.icon.padEnd(2, ' ')}
        {stepValue.label}
      </Text>
    )
  }

  return (
    <>
      <Box
        height={14}
        gap={1}
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
      >
        <Text bold>Download Status</Text>
        {steps.map((step) => (
          <Box key={step.id}>{handleStep(step)}</Box>
        ))}
      </Box>
      <SnakeLoader
        colors={[colors.blue.default, colors.blue.light]}
        width={80}
      />
    </>
  )
}
