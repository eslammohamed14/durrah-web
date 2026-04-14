'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
} from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  /** Pass 'rtl' or 'ltr' to control text direction */
  dir?: 'ltr' | 'rtl';
  label?: string;
  id?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  dir,
  label,
  id: externalId,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const generatedId = useId();
  const id = externalId ?? generatedId;
  const listboxId = `${id}-listbox`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const enabledOptions = options.map((o, i) => ({ ...o, index: i })).filter((o) => !o.disabled);

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    triggerRef.current?.focus();
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !listRef.current?.contains(target)
      ) {
        close();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open, close]);

  // Focus active item when it changes
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    const item = listRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    item?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown': {
        e.preventDefault();
        setOpen(true);
        const firstEnabled = enabledOptions[0];
        setActiveIndex(firstEnabled ? firstEnabled.index : -1);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setOpen(true);
        const lastEnabled = enabledOptions[enabledOptions.length - 1];
        setActiveIndex(lastEnabled ? lastEnabled.index : -1);
        break;
      }
    }
  };

  const handleListKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    switch (e.key) {
      case 'Escape': {
        e.preventDefault();
        close();
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        const currentPos = enabledOptions.findIndex((o) => o.index === activeIndex);
        const next = enabledOptions[currentPos + 1] ?? enabledOptions[0];
        if (next) setActiveIndex(next.index);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        const currentPos = enabledOptions.findIndex((o) => o.index === activeIndex);
        const prev =
          enabledOptions[currentPos - 1] ?? enabledOptions[enabledOptions.length - 1];
        if (prev) setActiveIndex(prev.index);
        break;
      }
      case 'Home': {
        e.preventDefault();
        const first = enabledOptions[0];
        if (first) setActiveIndex(first.index);
        break;
      }
      case 'End': {
        e.preventDefault();
        const last = enabledOptions[enabledOptions.length - 1];
        if (last) setActiveIndex(last.index);
        break;
      }
      case 'Enter':
      case ' ': {
        e.preventDefault();
        if (activeIndex >= 0) {
          const opt = options[activeIndex];
          if (opt && !opt.disabled) {
            onChange?.(opt.value);
            close();
          }
        }
        break;
      }
      case 'Tab': {
        close();
        break;
      }
    }
  };

  const handleOptionClick = (option: DropdownOption) => {
    if (option.disabled) return;
    onChange?.(option.value);
    close();
  };

  return (
    <div className={['relative inline-block', className].join(' ')} dir={dir}>
      {label && (
        <label
          htmlFor={id}
          className={[
            'mb-1 block text-sm font-medium',
            disabled ? 'text-gray-400' : 'text-gray-700',
          ].join(' ')}
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined
        }
        disabled={disabled}
        onKeyDown={handleTriggerKeyDown}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => !prev);
          if (!open) {
            const selectedIndex = options.findIndex((o) => o.value === value);
            setActiveIndex(selectedIndex >= 0 ? selectedIndex : -1);
          }
        }}
        className={[
          'flex w-full min-w-40 items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm',
          'bg-white shadow-sm transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
          disabled
            ? 'cursor-not-allowed border-gray-200 text-gray-400'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50',
        ].join(' ')}
      >
        <span className={selectedOption ? '' : 'text-gray-400'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          aria-hidden="true"
          className={['h-4 w-4 shrink-0 transition-transform', open ? 'rotate-180' : ''].join(' ')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Listbox */}
      {open && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          aria-label={label ?? placeholder}
          tabIndex={-1}
          onKeyDown={handleListKeyDown}
          // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
          className={[
            'absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200',
            'bg-white py-1 shadow-lg',
            'focus:outline-none',
            dir === 'rtl' ? 'right-0' : 'left-0',
          ].join(' ')}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <li
                key={option.value}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={option.disabled}
                data-index={index}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                className={[
                  'flex cursor-pointer select-none items-center px-3 py-2 text-sm',
                  option.disabled
                    ? 'cursor-not-allowed text-gray-300'
                    : isActive
                    ? 'bg-blue-50 text-blue-700'
                    : isSelected
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50',
                ].join(' ')}
              >
                {option.label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

Dropdown.displayName = 'Dropdown';
