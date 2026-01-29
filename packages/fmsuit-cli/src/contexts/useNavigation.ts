import {
  createContext,
  useContext,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from 'react'
import { useInput } from 'ink'

interface Props {
  id: string
  onSelect?: () => void
}

interface ContextType {
  activeId: string
  register: (id: string) => void
  unregister: (id: string) => void
  setFocus: Dispatch<SetStateAction<string>>
}

export const NavigationContext = createContext<ContextType | undefined>(
  undefined,
)

/**
 * Custom hook to access the NavigationContext.
 * Provides access to the active focus state and navigation management functions.
 * Must be used within a component tree that has a NavigationProvider.
 *
 * @returns {ContextType} The navigation context with activeId, register, unregister, and setFocus
 * @throws {Error} If used outside of a NavigationProvider component
 *
 * @example
 * const { activeId, setFocus } = useNavigationContext();
 */
export function useNavigationContext(): ContextType {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error(
      'useNavigationContext must be used within a NavigationProvider',
    )
  }
  return context
}

/**
 * Custom hook for managing focus and keyboard input handling for navigable elements.
 * Automatically registers and unregisters the element with the navigation system.
 * Handles Enter key input to trigger the onSelect callback when the element is focused.
 *
 * @param {Props} props - Hook configuration
 * @param {string} props.id - Unique identifier for the navigable element
 * @param {() => void} [props.onSelect] - Callback function triggered when Enter is pressed on focused element
 *
 * @returns {Object} Navigation state
 * @returns {boolean} return.isFocused - Whether this element currently has focus
 *
 * @example
 * const { isFocused } = useNavigation({
 *   id: "button-1",
 *   onSelect: () => handleClick()
 * });
 */
export function useNavigation({ id, onSelect }: Props): { isFocused: boolean } {
  const { activeId, register, unregister } = useNavigationContext()
  const isFocused = activeId === id

  useEffect(() => {
    register(id)
    return (): void => unregister(id)
  }, [id, unregister, register])

  useInput((_, key) => {
    if (isFocused && key.return && onSelect) {
      onSelect()
    }
  })

  return { isFocused }
}
