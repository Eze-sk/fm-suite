import { Box, Text, type BoxProps } from "ink"
import { useEffect, useState } from "react"

/**
 * Props for the SnakeLoader component.
 * @interface SkLoaderProps
 * @extends {BoxProps}
 * @property {string[]} colors - An array of colors to use for the snake.
 * @property {number} width - The width of the loader.
 */
interface SkLoaderProps extends BoxProps {
  colors: string[]
  width: number
}

const CHARS = ['▁', '▁']

/**
 * A snake-like loading animation component.
 * @param {SkLoaderProps} { colors, width, ...att } - The props for the component.
 * @returns {React.ReactNode} The SnakeLoader component.
 */
export default function SnakeLoader({ colors, width, ...att }: SkLoaderProps): React.ReactNode {
  const [frame, setFrame] = useState(0)

  const charSize = Math.ceil(width / CHARS.length)

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % width)
    }, 100)

    return (): void => clearInterval(timer)
  }, [])


  return (
    <Box width={width} {...att}>
      {
        Array.from({ length: width }).map((_, i) => {
          const relativePos = (i + frame) % width

          const charSizeIndex = Math.floor(relativePos / charSize) % CHARS.length

          return (
            <Text color={colors[charSizeIndex]} key={i}>
              {CHARS[charSizeIndex]}
            </Text>
          )
        })
      }
    </Box>
  )
}