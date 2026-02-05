import { useInput } from 'ink'
import { useCallback, useState } from 'react'
import { NavigationContext } from './useNavigation'

interface FocusManagerType {
  children: React.ReactNode
}

interface NavItem {
  id: string;
  onSelect?: () => void;
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
export function FocusManager({ children }: FocusManagerType): React.ReactNode {
  const [activeId, setActiveId] = useState<string>('')
  const [items, setItems] = useState<NavItem[]>([])

  const register = useCallback((id: string, onSelect?: () => void) => {
    setItems((prev) => {
      if (prev.find(i => i.id === id)) return prev
      if (prev.length === 0) setActiveId(id)
      return [...prev, { id, onSelect }]
    })
  }, [])

  const unregister = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  useInput((_, key) => {
    if (items.length === 0) return

    const currentIndex = items.findIndex(i => i.id === activeId);

    if (key.upArrow) {
      const nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
      setActiveId(items[nextIndex]?.id ?? '')
    }

    if (key.downArrow) {
      const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
      setActiveId(items[nextIndex]?.id ?? '')
    }

    if (key.return) {
      const activeItem = items.find(i => i.id === activeId);
      if (activeItem?.onSelect) {
        activeItem.onSelect();
      }
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
