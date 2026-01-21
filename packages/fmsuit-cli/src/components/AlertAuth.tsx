import { Box, Text, useInput } from 'ink';

import { theme } from '@/colorPalette';

import CenterElement from './Center';

interface Props {
  onConfirm: (val: boolean) => void
}

/**
 * Displays an alert dialog prompting the user to open their browser for authentication.
 * Listens for the Enter key press to confirm and proceed with browser opening.
 * @component
 * @param {Props} props - Component props
 * @param {Function} props.onConfirm - Callback function invoked when user presses Enter
 * @returns {React.ReactNode} Alert dialog UI
 */
export default function AuthRequiredAlert({
  onConfirm,
}: Props): React.ReactNode {
  useInput((_, key) => {
    if (key.return) {
      onConfirm(true)
    }
  })

  return (
    <CenterElement>
      <Box
        paddingY={1}
        paddingX={2}
        flexDirection="column"
        borderStyle="round"
        borderColor={theme.warning}
      >
        <Box flexDirection="column" gap={1}>
          <Text bold color={theme.warning}>
            NO ACTIVE SESSION FOUND.
          </Text>
          <Text>Please allow opening your browser to log in and continue.</Text>
        </Box>
        <Box
          marginTop={2}
          paddingY={1}
          paddingX={2}
          justifyContent="center"
          borderStyle="round"
          borderColor={theme.warning}
        >
          <Text color={theme.warning} bold>
            PRESS ENTER TO OPEN BROWSER
          </Text>
        </Box>
      </Box>
    </CenterElement>
  )
}
