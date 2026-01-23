import { Box } from 'ink';
import TextInput from 'ink-text-input';
import { memo, useState } from 'react';

interface Props {
  onChange: (e: string) => void
  placeholder?: string
}

/**
 * Renders a bordered text input field for searching challenges.
 * @component
 * @param {Props} props - Component props
 * @param {Function} props.onChange - Callback function invoked when input value changes
 * @param {string} [props.placeholder='seek out challenges'] - Placeholder text displayed in the input
 * @returns {React.ReactNode} Search input field
 */
export const SearchInput = memo(({ onChange, placeholder = 'Search for a challenge...' }: Props) => {
  const [localValue, setLocalValue] = useState('');

  const handleChange = (v: string): void => {
    setLocalValue(v);
    onChange(v);
  };

  return (
    <Box paddingY={1} paddingX={2} width={80} borderStyle="round">
      <TextInput
        value={localValue}
        onChange={handleChange}
        focus={true}
        showCursor={true}
        placeholder={placeholder}
        highlightPastedText
      />
    </Box>
  );
});
