import FocusElement from "@components/ui/FocusElement";
import { colors } from "@/colorPalette";
import type { StatesChallenge } from "@typings/challengeData";

type BtsStatus = Record<StatesChallenge, { color: string, message: string }>

interface Props {
  onAction: () => void
  setStatus: StatesChallenge
}

/**
 * ChallengeActionButton component for challenge actions.
 * @param {object} props - The component props.
 * @param {() => void} props.onAction - Callback when the button is pressed.
 * @param {StatesChallenge} props.setStatus - The current status of the challenge.
 * @returns {React.ReactNode} The rendered action button.
 */

export default function ChallengeActionButton({ onAction, setStatus }: Props): React.ReactNode {
  const btsStatus: BtsStatus = {
    "pending": {
      color: colors.rose,
      message: "Start Challenge"
    },
    "started": {
      color: colors.blue.light,
      message: "starting..."
    },
    "completed": {
      color: colors.blue.default,
      message: "Submit Solution"
    },
    "new_start": {
      color: colors.pink,
      message: "Start over"
    }
  }

  const btsColor = btsStatus[setStatus].color
  const btsMessage = btsStatus[setStatus].message

  return (
    <FocusElement
      id="start-challenge"
      onAction={onAction}
      addMark={false}
      hasBorder
      width={25}
      justifyContent="center"
      placeholder={false}
      color={btsColor}
    >
      <FocusElement.Text
        italic
        label={btsMessage}
      />
    </FocusElement>
  )
}