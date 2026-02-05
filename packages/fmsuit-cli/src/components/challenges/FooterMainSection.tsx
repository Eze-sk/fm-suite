import { theme } from "@/colorPalette";
import { Box, Text } from "ink";

type AddShortcut = {
  key: string
  message: string
}

interface Props {
  addShortcut?: AddShortcut[]
}

/**
 * FooterMainSection component displays navigation shortcuts.
 * @param {object} props - The component props.
 * @param {Array<Object>} [props.addShortcut] - An array of additional shortcuts to display.
 * @param {string} props.addShortcut[].key - The key for the shortcut.
 * @param {string} props.addShortcut[].message - The message associated with the shortcut.
 * @returns {React.ReactNode} The rendered component.
 */
export default function FooterMainSection({ addShortcut = [] }: Props): React.ReactNode {
  return (
    <Box justifyContent="flex-end" width={80}>
      <Text color="gray">
        {
          addShortcut.map((value) => (
            <>
              <Text
                color={theme.secondary}
                key={value.key.trim()}
              >
                {value.key}
              </Text>
              ${value.message} •{' '}
            </>
          ))
        }
        <Text color={theme.secondary}>↑↓</Text> to navigate •{' '}
        <Text color={theme.secondary}>Enter</Text> to interact
      </Text>
    </Box>
  )
}