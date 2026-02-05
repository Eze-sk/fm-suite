import { Box, useInput } from 'ink'
import FocusElement from './FocusElement'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useNavigationContext } from '@/contexts/useNavigation'

type Option = {
  id: string
  value: string
  children?: Option[]
}

export type Selected = {
  id: string
  value: string
}

export type SelectType = {
  id: string
  title: string
  option: Option[]
  isDisabled?: boolean
  nextFocus?: string
  placeholder?: string
  onOpen?: (v: boolean) => void
  onChange?: (selected: Selected[]) => void
}

export type SelectHandle = {
  openMenu: () => void;
  closeMenu: () => void;
}

/**
 * Select component - A hierarchical dropdown menu for CLI interfaces.
 * Supports nested options with Tab key navigation through hierarchy levels.
 * Manages focus state and communicates selections through the onChange callback.
 *
 * @component
 * @param {SelectType} props - Component props
 * @param {string} props.id - Unique identifier for the select in the navigation system
 * @param {string} props.title - Menu title/label displayed to user
 * @param {Option[]} props.option - Array of options, each can have nested children for sub-menus
 * @param {boolean} [props.isDisabled] - Disables menu interaction when true
 * @param {string} [props.nextFocus] - Focus target after selection completes
 * @param {string} [props.placeholder] - Text shown when menu is focused
 * @param {(selected: Selected[]) => void} [props.onChange] - Called when leaf option is selected with full path
 *
 * @returns {React.ReactNode} The rendered hierarchical select menu
 *
 * @example
 * // Hierarchical options with Tab navigation
 * <Select
 *   id="settings"
 *   title="Settings"
 *   option={[
 *     {
 *       id: "display",
 *       value: "Display",
 *       children: [
 *         { id: "theme", value: "Theme" },
 *         { id: "font", value: "Font Size" }
 *       ]
 *     }
 *   ]}
 *   onChange={(selected) => handleSettings(selected)}
 *   nextFocus="save-button"
 * />
 */
const Select = forwardRef<SelectHandle, SelectType>(({
  id,
  title,
  option,
  isDisabled,
  nextFocus,
  placeholder,
  onOpen,
  onChange,
}, ref) => {
  const [open, setOpen] = useState(false)
  const [navigationStack, setNavigationStack] = useState<Option[][]>([option])
  const [selectedPath, setSelectedPath] = useState<Option[]>([])

  const { setFocus } = useNavigationContext()

  const currentOptions = navigationStack[navigationStack.length - 1]

  useImperativeHandle(ref, () => ({
    openMenu: (): void => {
      setOpen(true);
      setNavigationStack([option]);
    },
    closeMenu: (): void => setOpen(false)
  }))

  const toggleMenu = (): void => {
    if (isDisabled) return
    const nextState = !open;
    setOpen(nextState);
    if (nextState) {
      setNavigationStack([option]);
      onOpen?.(open);
    }
  }

  const onSelect = (opt: Option): void => {
    const { children } = opt

    if (children && children.length > 0) {
      const [firstChild] = children

      setNavigationStack((prev) => [...prev, children])
      setSelectedPath((prev) => [...prev, opt])
      setFocus(firstChild!.id)
    } else {
      const finalSelection: Selected[] = [...selectedPath, opt].map((item) => ({
        id: item.id,
        value: item.value,
      }))

      onChange?.(finalSelection)
      setOpen(false)
      setFocus(nextFocus ?? id)
    }
  }

  useInput((_, key) => {
    if (navigationStack.length > 1 && key.tab) {
      const parentOption = selectedPath[selectedPath.length - 1]

      setNavigationStack(navigationStack.slice(0, -1))
      setSelectedPath(selectedPath.slice(0, -1))

      if (parentOption) {
        setFocus(parentOption.id)
      }
    }
  })

  return (
    <Box flexDirection="column">
      <FocusElement
        id={id}
        onAction={toggleMenu}
        isDisabled={isDisabled}
        placeholder={placeholder}
        marginBottom={1}
      >
        <FocusElement.Text label={`${open ? '⏷' : '▶'} ${title}`} />
      </FocusElement>
      {open &&
        currentOptions?.map((opt) => (
          <Box key={opt.id} marginLeft={2}>
            <FocusElement id={opt.id} onAction={() => onSelect(opt)}>
              <Box gap={1}>
                <FocusElement.Text label={opt.value} bold />
              </Box>
            </FocusElement>
          </Box>
        ))
      }
    </Box>
  )
})

export default Select