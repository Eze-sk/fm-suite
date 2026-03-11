import type { ChallengeScrap } from '@typings/challengeData'
import { Box, Text, useInput } from 'ink'

import { technologiesQuestions } from '@/config/questions'
import { useEffect, useState } from 'react'
import open from 'open'
import ChallengeActionButton from './ui/ActionButton'
import HeaderSection from './ui/HeaderSection'
import { useNavigationContext } from '@/contexts/useNavigation'
import { updateChallenge } from '@lib/challenge.controller'
import { useAppStore } from '@/stores/useApp'
import LoadingDownloadSteps from './ChallengeSectionSteps/LoadingDownload'
import StartSteps from './ChallengeSectionSteps/Start'

export type StepSection = 'start' | 'loading'

interface Props {
  challengeData: ChallengeScrap | undefined
}

export default function ChallengeSection({
  challengeData,
}: Props): React.ReactNode {
  const [isInit, setIsInit] = useState(true)
  const { setFocus } = useNavigationContext()
  const updateData = useAppStore((state) => state.updateData)
  const [step, setStep] = useState<StepSection>('start')

  const status = challengeData?.status ?? 'pending'

  const handleActionChallenge = async (): Promise<void> => {
    if (status === 'pending' || status === 'new_start') {
      setIsInit(!isInit)
      setFocus(technologiesQuestions.option[0]?.id ?? technologiesQuestions.id)
      await updateChallenge({
        id: challengeData?.id ?? 0,
        key: 'status',
        value: 'started',
      })
      await updateData()
    }
  }

  useInput((input, key) => {
    if (key.ctrl && input === 'o') {
      open(challengeData?.downloadLink ?? '')
    }
  })

  return (
    <Box width={80} flexDirection="column">
      <HeaderSection data={challengeData} />
      <Box height={20} marginTop={1} flexDirection="column">
        <ChallengeActionButton
          onAction={handleActionChallenge}
          getStatus={status}
        />
        {step === 'start' && (
          <StartSteps
            data={challengeData}
            isInit={isInit}
            setIsInit={setIsInit}
            status={status}
            nextStep={setStep}
          />
        )}
        {step === 'loading' && (
          <LoadingDownloadSteps nextStep={setStep} data={challengeData} />
        )}
      </Box>
      <Box marginLeft={1}>
        <Text color="gray" italic>
          <Text bold>ctrl + O</Text> to open the challenge in your browser
        </Text>
      </Box>
    </Box>
  )
}
