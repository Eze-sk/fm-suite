import { useInput } from 'ink'
import { useCallback, useState } from 'react'
import { NavigationContext } from './useNavigation'

interface Props {
  children: React.ReactNode
}

/**
 * FocusManager component - Provider for managing focus and navigation state across the application.
 * Handles keyboard navigation (up/down arrows) to cycle through registered focusable elements.
 * Provides NavigationContext to child components for focus management and element registration.
 *
 * @component
 * @param {Props} props - Component props
 * @param {React.ReactNode} props.children - Child components that can use useNavigation and useNavigationContext
 *
 * @returns {React.ReactNode} The NavigationContext provider wrapping children
 *
 * Features:
 * - Registers/unregisters focusable elements dynamically
 * - Cycles focus with up/down arrow keys
 * - Wraps automatically at start/end (circular navigation)
 * - Provides context for accessing and controlling focus state
 *
 * @example\n * <FocusManager>
 *   <YourApp />
 * </FocusManager>
 */
export function FocusManager({ children }: Props): React.ReactNode {
  const [activeId, setActiveId] = useState<string>('')
  const [items, setItems] = useState<string[]>([])

  const register = useCallback((id: string) => {
    setItems((prev) => {
      if (prev.includes(id)) return prev
      const addItem = [...prev, id]
      if (prev.length === 0) setActiveId(id)
      return addItem
    })
  }, [])

  const unregister = useCallback((id: string) => {
    setItems((prev) => {
      const newItem = prev.filter((i) => i !== id)
      return newItem
    })
  }, [])

  useInput((_, key) => {
    if (items.length === 0) return

    const currentIndex = items?.indexOf(activeId)

    if (key.upArrow) {
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
      setActiveId(items[nextIndex] ?? '')
    }

    if (key.downArrow) {
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
      setActiveId(items[nextIndex] ?? '')
    }
  })

  return (
    <NavigationContext.Provider
      value={{ activeId, register, unregister, setFocus: setActiveId }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
