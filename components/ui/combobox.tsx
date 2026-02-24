'use client';

import * as React from 'react';
import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, ChevronDown, X } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface ComboboxOption {
    id: string;
    label: string;
}

export interface ComboboxProps<T = ComboboxOption> {
    /** Options to display. Can be empty before async load. */
    items: T[];
    /** Currently selected value (id string). */
    value: string;
    /** Called when selection changes. Receives the selected item's id or "". */
    onValueChange: (value: string) => void;
    /** Get the unique id from an item. */
    getItemValue: (item: T) => string;
    /** Get the display label from an item. */
    getItemLabel: (item: T) => string;
    placeholder?: string;
    emptyMessage?: string;
    className?: string;
    /** Optional: trigger when the input is focused (e.g. to load options). */
    onFocus?: () => void;
    disabled?: boolean;
    id?: string;
}

const comboboxInputClass =
    'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm';

export function Combobox<T>({
    items,
    value,
    onValueChange,
    getItemValue,
    getItemLabel,
    placeholder = 'Select…',
    emptyMessage = 'No items found.',
    className,
    onFocus,
    disabled = false,
    id,
}: ComboboxProps<T>) {
    const selectedItem = React.useMemo(
        () => items.find((item) => getItemValue(item) === value) ?? null,
        [items, value, getItemValue]
    );

    const handleValueChange = React.useCallback(
        (item: T | null) => {
            onValueChange(item ? getItemValue(item) : '');
        },
        [onValueChange, getItemValue]
    );

    const isItemEqualToValue = React.useCallback(
        (a: T, b: T | null) => (b ? getItemValue(a) === getItemValue(b) : false),
        [getItemValue]
    );

    return (
        <BaseCombobox.Root
            items={items}
            value={selectedItem}
            onValueChange={handleValueChange}
            itemToStringLabel={getItemLabel}
            isItemEqualToValue={isItemEqualToValue}
            disabled={disabled}
        >
            <div
                className={cn(
                    'relative flex w-full [&>input]:pr-[calc(0.5rem+1.75rem)] has-[.combobox-clear]:[&>input]:pr-[calc(0.5rem+1.75rem*2)]',
                    className
                )}
            >
                <BaseCombobox.Input
                    id={id}
                    placeholder={placeholder}
                    onFocus={onFocus}
                    className={cn(comboboxInputClass, 'w-full min-w-0')}
                />
                <div className="absolute right-1 bottom-0 flex h-9 items-center justify-center text-muted-foreground">
                    <BaseCombobox.Clear
                        className="combobox-clear flex h-7 w-7 items-center justify-center rounded-sm bg-transparent p-0 hover:bg-accent hover:text-accent-foreground"
                        aria-label="Clear selection"
                    >
                        <X className="size-4" />
                    </BaseCombobox.Clear>
                    <BaseCombobox.Trigger
                        className="flex h-7 w-7 items-center justify-center rounded-sm bg-transparent p-0 hover:bg-accent hover:text-accent-foreground"
                        aria-label="Open list"
                    >
                        <ChevronDown className="size-4" />
                    </BaseCombobox.Trigger>
                </div>
            </div>

            <BaseCombobox.Portal>
                <BaseCombobox.Positioner className="z-50 outline-none" sideOffset={4}>
                    <BaseCombobox.Popup
                        className={cn(
                            'w-[var(--anchor-width)] max-h-[min(23rem,var(--available-height))] max-w-[var(--available-width)]',
                            'rounded-md border border-input bg-popover text-popover-foreground shadow-md',
                            'overflow-hidden py-1',
                            'data-[ending-style]:animate-out data-[ending-style]:fade-out-0 data-[ending-style]:zoom-out-95',
                            'data-[starting-style]:animate-in data-[starting-style]:fade-in-0 data-[starting-style]:zoom-in-95'
                        )}
                    >
                        <BaseCombobox.Empty className="px-3 py-2 text-sm text-muted-foreground empty:p-0 empty:m-0">
                            {emptyMessage}
                        </BaseCombobox.Empty>
                        <BaseCombobox.List className="max-h-[min(23rem,var(--available-height))] overflow-y-auto py-1 outline-none data-[empty]:p-0">
                            {(item: T) => (
                                <BaseCombobox.Item
                                    key={getItemValue(item)}
                                    value={item}
                                    className={cn(
                                        'relative flex cursor-default select-none items-center gap-2 py-2 pl-3 pr-8 text-sm outline-none',
                                        'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground'
                                    )}
                                >
                                    <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
                                        <Check
                                            className={cn(
                                                'size-4',
                                                getItemValue(item) === value ? 'opacity-100' : 'opacity-0'
                                            )}
                                        />
                                    </span>
                                    <span className="pl-6 truncate">{getItemLabel(item)}</span>
                                </BaseCombobox.Item>
                            )}
                        </BaseCombobox.List>
                    </BaseCombobox.Popup>
                </BaseCombobox.Positioner>
            </BaseCombobox.Portal>
        </BaseCombobox.Root>
    );
}
