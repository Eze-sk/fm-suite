import { Box, type BoxProps } from 'ink'

interface Props extends BoxProps {
  children: React.ReactNode
}

/**
 * A layout component that centers its children both horizontally and vertically.
 * Extends Box props for additional styling flexibility.
 * @component
 * @param {Props} props - Component props extending BoxProps
 * @param {React.ReactNode} props.children - Content to be centered
 * @returns {React.ReactNode} Centered container
 */
export default function CenterElement({
  children,
  ...att
}: Props): React.ReactNode {
  return (
    <Box
      flexGrow={1}
      height={40}
      justifyContent="center"
      alignItems="center"
      {...att}
    >
      {children}
    </Box>
  )
}
