import { useEffect, useRef, useState } from "react";

import { Box } from "ink";
import FocusElement from "@components/ui/FocusElement";
import type { ChallengeScrap, StatesChallenge } from "@typings/challengeData";
import { useDownloadChallenge } from "@hooks/useDownloadManager";
import Select, { type SelectHandle } from "@components/ui/Select";
import type { PackageManagerType, TechnologySelector } from "@typings/technologySelector";

import { packageManagerQuestion, technologiesQuestions } from "@/config/questions";

import { useNavigationContext } from "@/contexts/useNavigation";
import type { StepSection } from "../ChallengeSection";

/**
 * Props for the StartSteps component.
 * @interface StartProps
 * @property {ChallengeScrap | undefined} data - The challenge data.
 * @property {StatesChallenge} status - The status of the challenge.
 * @property {boolean} isInit - Indicates if the component is initialized.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setIsInit - Setter for the isInit state.
 * @property {React.Dispatch<React.SetStateAction<StepSection>>} nextStep - Function to navigate to the next step.
 */

interface StartProps {
  data: ChallengeScrap | undefined
  status: StatesChallenge
  isInit: boolean
  setIsInit: React.Dispatch<React.SetStateAction<boolean>>
  nextStep: React.Dispatch<React.SetStateAction<StepSection>>
}

/**
 * Component for the starting step of a challenge.
 * Allows users to select technology and package manager, then start the download.
 * @param {StartProps} { data, status, isInit, setIsInit, nextStep } - The props for the component.
 * @returns {React.ReactNode} The StartSteps component.
 */
export default function StartSteps({ data, status, isInit, setIsInit, nextStep }: StartProps): React.ReactNode {
  const [isStart, setIsStart] = useState(true)
  const [technologie, setTechnologie] = useState<TechnologySelector | null>(null)
  const [pkgMgr, setPkgMgr] = useState<PackageManagerType | null>(null)
  const { setFocus } = useNavigationContext()

  const selectTecRef = useRef<SelectHandle | null>(null)
  const selectPkgRef = useRef<SelectHandle | null>(null)

  const { startDownload } = useDownloadChallenge({
    downloadLink: data?.downloadLink ?? "",
    technologie: technologie ?? "empty",
    challengeData: data,
    packageManager: pkgMgr ?? "pnpm"
  })

  useEffect(() => {
    if (status === "started") {
      setIsInit(!isInit)
      setFocus(technologiesQuestions.option[0]?.id ?? technologiesQuestions.id)
      selectTecRef.current?.openMenu()
    }
  }, [status])

  const handleSelectTec = (t: string): void => {
    const tec = t as TechnologySelector
    setIsInit(!isInit)
    setIsStart(!isStart)
    setTechnologie(tec)
    selectTecRef.current?.closeMenu()
    selectPkgRef.current?.openMenu()
  }

  const handleSelectPkgMgr = (pkgMgr: string): void => {
    const pkg = pkgMgr as PackageManagerType
    setPkgMgr(pkg)
    selectPkgRef.current?.closeMenu()
  }

  const handleStartChallenge = async (): Promise<void> => {
    startDownload()
    nextStep("loading")
  }

  return (
    <Box flexDirection="column">
      <Select
        ref={selectTecRef}
        onChange={(v) => handleSelectTec(v.id)}
        isDisabled={isInit}
        nextFocus={packageManagerQuestion.option[0]?.id ?? packageManagerQuestion.id}
        {...technologiesQuestions}
      />
      <Select
        ref={selectPkgRef}
        onChange={(v) => handleSelectPkgMgr(v.id)}
        isDisabled={pkgMgr ? false : true}
        nextFocus="confirm_challenge"
        {...packageManagerQuestion}
      />
      <FocusElement
        id="confirm_challenge"
        isDisabled={technologie ? false : true}
        onAction={handleStartChallenge}
      >
        <FocusElement.Text label="Ready to build?" />
      </FocusElement>
    </Box>
  )
}
