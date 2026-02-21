import { Text } from 'ink'

interface Props {
  width?: number
}

export default function Divider({ width = 10 }: Props): React.ReactNode {
  const lineLength = '—'.repeat(width)

  return <Text>{lineLength}</Text>
}
