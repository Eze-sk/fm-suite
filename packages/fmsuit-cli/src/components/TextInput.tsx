import { Box } from 'ink'
import TextInput from 'ink-text-input'

interface Props {
  value: string
  onChange: (e: string) => void
  placeholder?: string
}

/**
 * Renders a bordered text input field for searching challenges.
 * @component
 * @param {Props} props - Component props
 * @param {string} props.value - Current input value
 * @param {Function} props.onChange - Callback function invoked when input value changes
 * @param {string} [props.placeholder='seek out challenges'] - Placeholder text displayed in the input
 * @returns {React.ReactNode} Search input field
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'seek out challenges',
}: Props): React.ReactNode {
  return (
    <Box paddingY={1} paddingX={2} width={80} borderStyle="round">
      <TextInput
        value={value}
        onChange={(e) => onChange(e)}
        placeholder={placeholder}
      />
    </Box>
  )
}
