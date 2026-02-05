import { Box, Text } from "ink";
import PlanTag from "../tags/Plan";
import LanguagesTag from "../tags/Languages";
import DifficultyTag from "../tags/Difficulty";
import type { ChallengeScrap } from "@typings/challengeData";

interface Props {
  data: ChallengeScrap | undefined
}

/**
 * HeaderSection component displays challenge metadata and description.
 * @param {object} props - The component props.
 * @param {ChallengeScrap | undefined} props.data - The challenge data to display.
 * @returns {React.ReactNode} The rendered header section.
 */

export default function HeaderSection({ data }: Props): React.ReactNode {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box
        justifyContent="space-between"
        alignItems="center"
        marginBottom={2}
      >
        <Box gap={2}>
          <PlanTag plan={data?.plan} />
          {data?.languages.map((l) => (
            <LanguagesTag language={l} key={l} />
          ))}
        </Box>
        <DifficultyTag level={data?.difficulty} />
      </Box>
      <Box gap={1} flexDirection="column">
        <Text>{data?.title.toUpperCase()}</Text>
        <Text>{data?.description}</Text>
      </Box>
    </Box>
  )
}