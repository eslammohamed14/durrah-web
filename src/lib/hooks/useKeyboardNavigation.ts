"use client";

/**
 * useKeyboardNavigation — keyboard navigation hook for list/menu widgets
 * (dropdowns, menus, listboxes, etc.).
 *
 * Requirements: 22.1, 22.4
 *
 * Handles:
 *  - ArrowUp / ArrowDown — move between items
 *  - Home / End          — jump to first / last item
 *  - Escape              — call `onClose`
 *  - Enter / Space       — call `onSelect` with the current index
 *
 * Usage:
 *   const { activeIndex, handleKeyDown, setActiveIndex } = useKeyboardNavigation({
 *     itemCount: options.length,
 *     isOpen,
 *     onClose: () => setOpen(false),
 *     onSelect: (index) => handleSelect(options[index]),
 *   });
 */

import { useCallback, useState } from "react";

export interface UseKeyboardNavigationOptions {
  /** Total number of navigable items. */
  itemCount: number;
  /** Whether the widget is open / active. */
  isOpen: boolean;
  /** Called when Escape is pressed. */
  onClose?: () => void;
  /** Called when Enter or Space is pressed on the active item. */
  onSelect?: (index: number) => void;
  /**
   * Whether navigation should wrap around at the boundaries.
   * Default: true.
   */
  wrap?: boolean;
}

export interface UseKeyboardNavigationResult {
  /** Index of the currently highlighted item (-1 means none). */
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  /** Attach this to the container element's onKeyDown. */
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export function useKeyboardNavigation({
  itemCount,
  isOpen,
  onClose,
  onSelect,
  wrap = true,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationResult {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          setActiveIndex((prev) => {
            if (prev === -1 || (prev >= itemCount - 1 && !wrap)) {
              return wrap ? 0 : prev;
            }
            return prev >= itemCount - 1 ? 0 : prev + 1;
          });
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          setActiveIndex((prev) => {
            if (prev <= 0 && !wrap) return 0;
            return prev <= 0 ? itemCount - 1 : prev - 1;
          });
          break;
        }
        case "Home": {
          e.preventDefault();
          setActiveIndex(0);
          break;
        }
        case "End": {
          e.preventDefault();
          setActiveIndex(itemCount - 1);
          break;
        }
        case "Escape": {
          e.preventDefault();
          onClose?.();
          break;
        }
        case "Enter":
        case " ": {
          e.preventDefault();
          if (activeIndex >= 0) {
            onSelect?.(activeIndex);
          }
          break;
        }
      }
    },
    [isOpen, itemCount, wrap, onClose, onSelect, activeIndex],
  );

  return { activeIndex, setActiveIndex, handleKeyDown };
}
