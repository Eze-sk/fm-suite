import { colors } from '@/colorPalette'
import { useNavigation } from '@/contexts/useNavigation'
import { Box, Text, type BoxProps, type TextProps } from 'ink'
import { createContext, useContext, useEffect } from 'react'

interface FocusContextType {
  finalColor?: string | undefined
  isFocused: boolean
}

const FocusContext = createContext<FocusContextType | undefined>(undefined)

/**
 * Custom hook to access the FocusContext within FocusElement components.
 * Provides access to the focus state and final color of the focused element.
 *
 * @returns {FocusContextType} The focus context containing isFocused boolean and optional finalColor
 * @throws {Error} If used outside of a FocusElement.Root component
 *
 * @example
 * const { isFocused, finalColor } = useFocusContext();
 */
function useFocusContext(): FocusContextType {
  const context = useContext(FocusContext)

  if (!context) {
    throw new Error('useFocusContext must be used within a Root')
  }

  return context
}

interface RootProps extends BoxProps {
  children: React.ReactNode
  id: string
  onAction: () => void
  color?: string
  hasBorder?: boolean
  isDisabled?: boolean
  placeholder?: string | boolean
  addMark?: boolean | string
  isFocus?: (value: boolean) => void
}

/**
 * Root component for focus management in CLI UI.
 * Manages focus state and provides styling context to child components.
 * Integrates with the navigation system to handle focus and selection events.
 *
 * @component
 * @param {RootProps} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render within the focus container
 * @param {string} props.id - Unique identifier for the focus element in the navigation system
 * @param {() => void} props.onAction - Callback function triggered when the element is selected/focused
 * @param {string} [props.color] - Text color when not focused (uses CSS/Ink color names)
 * @param {boolean} [props.hasBorder] - Whether to display a border around the element
 * @param {boolean} [props.isDisabled] - If true, element cannot be focused and appears grayed out
 * @param {string | boolean} [props.placeholder="(Press Enter)"] - Text shown when focused, or false to hide
 * @param {boolean | string} [props.addMark=">"] - Mark/indicator shown when focused, or false to hide
 * @param {(value: boolean) => void} [props.isFocus] - Callback to receive focus state updates
 * @param {BoxProps} props - Additional Ink Box props for layout control
 *
 * @returns {React.ReactNode} The rendered focus element with context provider
 *
 * @example
 * <FocusElement.Root
 *   id="my-element"
 *   onAction={() => handleSelect()}
 *   color="green"
 *   hasBorder
 * >
 *   <FocusElement.Text label="Select me" />
 * </FocusElement.Root>
 */
export function Root({
  children,
  id,
  onAction,
  color,
  hasBorder,
  isDisabled,
  placeholder = '(Press Enter)',
  addMark = '>',
  isFocus,
  ...att
}: RootProps): React.ReactNode {
  const { isFocused } = useNavigation({
    id,
    onSelect: isDisabled ? undefined : onAction,
  })

  useEffect(() => {
    isFocus?.(isFocused)
  }, [isFocused, isFocus])

  const getTextColor = (): string | undefined => {
    if (isDisabled) return 'gray'
    if (isFocused) return colors.cyan
    return color
  }

  const finalColor = getTextColor()

  return (
    <Box
      alignItems="center"
      gap={1}
      {...(hasBorder && { borderStyle: 'round', borderColor: finalColor })}
      {...att}
    >
      {addMark && (
        <Text color={finalColor}>
          {isFocused ? addMark.toString().padEnd(2, ' ') : '  '}
        </Text>
      )}
      <FocusContext.Provider value={{ finalColor, isFocused }}>
        {children}
      </FocusContext.Provider>
      {isFocused && placeholder ? (
        <Text color="grey" dimColor>
          {placeholder}
        </Text>
      ) : null}
    </Box>
  )
}

interface MainTextProps extends TextProps {
  label: string
}

/**
 * Text component for displaying content within a FocusElement.
 * Automatically applies focus-aware styling using the FocusContext.
 * Applies italic styling when the element is focused.
 *
 * @component
 * @param {MainTextProps} props - Component props
 * @param {string} props.label - The text content to display
 * @param {TextProps} props - Additional Ink Text props for formatting
 *
 * @returns {React.ReactNode} The rendered text with context-aware styling
 *
 * @example
 * <FocusElement.Text label="Option 1" bold />
 */
export function MainText({ label, ...props }: MainTextProps): React.ReactNode {
  const { finalColor, isFocused } = useFocusContext()

  return (
    <Text color={finalColor} {...props} {...(isFocused && ['italic'])}>
      {label}
    </Text>
  )
}

/**
 * FocusElement - A composable CLI component for focus management and selection.
 * Combines Root component with MainText component for a complete focus-aware UI element.
 *
 * @example
 * // Basic usage with a focused element
 * <FocusElement
 *   id="menu-item-1"
 *   onAction={() => console.log('Selected!')}
 *   color="blue"
 *   hasBorder // Adds a border when focused
 *   isDisabled // Disables focus and grays out the element
 * >
 *   <FocusElement.Text label="Menu Item" />
 * </FocusElement>
 *
 */
const FocusElement = Object.assign(Root, {
  Text: MainText,
})

export default FocusElement
