'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { DateRange, SelectRangeEventHandler, SelectSingleEventHandler } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export interface MonthPickerProps {
    /** Month as `YYYY-MM`, the same shape `<input type="month">` produced. */
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    /** Latest selectable month as `YYYY-MM`. Defaults to the current month. */
    max?: string;
    'aria-label'?: string;
}

const toMonthValue = (date: Date) => format(date, 'yyyy-MM');

/**
 * Month selector built on the popover the rest of the app uses.
 *
 * `<input type="month">` renders the browser's own panel, which cannot be
 * themed and looks nothing like the surrounding UI, so the panel is ours: a
 * year stepper over a grid of months.
 */
export function MonthPicker({
    value,
    onChange,
    placeholder = 'Pick a month',
    className,
    max = toMonthValue(new Date()),
    'aria-label': ariaLabel,
}: Readonly<MonthPickerProps>) {
    const [open, setOpen] = React.useState(false);

    const selected = React.useMemo(() => {
        const match = /^(\d{4})-(\d{2})$/.exec(value ?? '');
        if (!match) return null;
        return { year: Number(match[1]), month: Number(match[2]) - 1 };
    }, [value]);

    // The visible year is independent of the selection, so the panel can be
    // browsed without committing to anything.
    const [viewYear, setViewYear] = React.useState(selected?.year ?? new Date().getFullYear());

    React.useEffect(() => {
        if (open && selected) setViewYear(selected.year);
    }, [open, selected]);

    const displayValue = selected
        ? format(new Date(selected.year, selected.month, 1), 'MMMM yyyy')
        : '';

    const today = new Date();
    const maxMatch = /^(\d{4})-(\d{2})$/.exec(max);
    const maxYear = maxMatch ? Number(maxMatch[1]) : today.getFullYear();
    const maxMonth = maxMatch ? Number(maxMatch[2]) - 1 : today.getMonth();

    const commit = (year: number, month: number) => {
        onChange?.(toMonthValue(new Date(year, month, 1)));
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Input
                    type="text"
                    readOnly
                    aria-label={ariaLabel}
                    value={displayValue}
                    placeholder={placeholder}
                    className={cn('cursor-pointer', className)}
                    startIcon={<CalendarIcon className="h-4 w-4" />}
                />
            </PopoverTrigger>
            {/* Aligned to the trigger's right edge: the panel is wider than the
                field, so anchoring it on the left pushed the overhang towards the
                edge of the viewport. collisionPadding keeps it clear of that edge
                wherever the field happens to sit. */}
            <PopoverContent className="w-64 p-0" align="end" collisionPadding={16}>
                <div className="flex items-center justify-between border-b px-2 py-2">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        // buttonVariants defaults width to w-fit, which would otherwise
                        // override the w-8 that size="icon-sm" contributes.
                        className="w-8"
                        aria-label="Previous year"
                        onClick={() => setViewYear((year) => year - 1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-semibold tabular-nums">{viewYear}</span>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="w-8"
                        aria-label="Next year"
                        disabled={viewYear >= maxYear}
                        onClick={() => setViewYear((year) => year + 1)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-3 gap-1 p-2">
                    {Array.from({ length: 12 }).map((_, month) => {
                        const isSelected = selected?.year === viewYear && selected?.month === month;
                        const isCurrent =
                            viewYear === today.getFullYear() && month === today.getMonth();
                        // Months that have not happened yet hold no data.
                        const isFuture =
                            viewYear > maxYear || (viewYear === maxYear && month > maxMonth);

                        return (
                            <Button
                                key={month}
                                variant={isSelected ? 'primary' : 'ghost'}
                                size="sm"
                                width="full"
                                disabled={isFuture}
                                onClick={() => commit(viewYear, month)}
                                className={cn(
                                    'font-normal',
                                    !isSelected && isCurrent && 'ring-1 ring-primary/40',
                                )}
                            >
                                {format(new Date(viewYear, month, 1), 'MMM')}
                            </Button>
                        );
                    })}
                </div>

                <div className="flex items-center justify-between border-t px-2 py-1.5">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="font-normal"
                        onClick={() => {
                            onChange?.('');
                            setOpen(false);
                        }}
                    >
                        Clear
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="font-normal text-primary"
                        onClick={() => commit(today.getFullYear(), today.getMonth())}
                    >
                        This month
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export interface DatePickerProps {
    value?: Date | DateRange | null;
    onChange?: (date: Date | DateRange | undefined) => void;
    mode?: 'single' | 'range';
    placeholder?: string;
    className?: string;
    showTime?: boolean;
    format?: string;
    captionLayout?: 'label' | 'dropdown';
    disabled?: (date: Date) => boolean;
    fromYear?: number;
    toYear?: number;
}

export function DatePicker({
    value,
    onChange,
    mode = 'single',
    placeholder = 'Pick a date',
    className,
    showTime = false,
    format: formatStr,
    captionLayout = 'label',
    disabled,
    fromYear = 1900,
    toYear = new Date().getFullYear() + 10,
}: Readonly<DatePickerProps>) {
    const [month, setMonth] = React.useState<Date>(
        (value instanceof Date ? value : (value as DateRange)?.from) || new Date(),
    );

    // Sync month when value changes externally (optional but good for UX)
    React.useEffect(() => {
        if (value instanceof Date) {
            setMonth(value);
        } else if ((value as DateRange)?.from) {
            setMonth((value as DateRange).from!);
        }
    }, [value]);
    // Parsing the value to String for Display
    const displayValue = React.useMemo(() => {
        if (!value) return '';

        const defaultFormat = showTime ? 'PPP HH:mm' : 'PPP';
        const fStr = formatStr || defaultFormat;

        if (mode === 'range') {
            const range = value as DateRange;
            if (range.from) {
                if (range.to) {
                    return `${format(range.from, fStr)} - ${format(range.to, fStr)}`;
                }
                return format(range.from, fStr);
            }
            return '';
        }

        return format(value as Date, fStr);
    }, [value, mode, formatStr, showTime]);

    // Time handling
    const setTime = (hours: number, minutes: number) => {
        if (mode === 'single' && value instanceof Date) {
            const newDate = new Date(value);
            newDate.setHours(hours);
            newDate.setMinutes(minutes);
            onChange?.(newDate);
        }
    };

    const hours = mode === 'single' && value instanceof Date ? value.getHours() : 0;
    const minutes = mode === 'single' && value instanceof Date ? value.getMinutes() : 0;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Input
                    type="text"
                    readOnly
                    value={displayValue}
                    placeholder={placeholder}
                    className={cn('cursor-pointer', className)}
                    startIcon={<CalendarIcon className="h-4 w-4" />}
                />
            </PopoverTrigger>
            <PopoverContent
                className="w-auto p-0 border-none shadow-lg rounded-lg overflow-hidden flex flex-col"
                align="start"
            >
                {mode === 'single' ? (
                    <Calendar
                        mode="single"
                        selected={(value as Date) ?? undefined}
                        onSelect={onChange as SelectSingleEventHandler}
                        month={month}
                        onMonthChange={setMonth}
                        initialFocus
                        captionLayout={captionLayout}
                        disabled={disabled}
                        fromYear={fromYear}
                        toYear={toYear}
                        className="p-3"
                    />
                ) : (
                    <Calendar
                        mode="range"
                        selected={(value as DateRange) ?? undefined}
                        onSelect={onChange as SelectRangeEventHandler}
                        month={month}
                        onMonthChange={setMonth}
                        initialFocus
                        captionLayout={captionLayout}
                        disabled={disabled}
                        fromYear={fromYear}
                        toYear={toYear}
                        className="p-3"
                    />
                )}
                <div className="flex flex-col border-t bg-muted/50">
                    {showTime && mode === 'single' && (
                        <div className="flex items-center gap-2 p-3 pb-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center gap-1 flex-1">
                                <Select
                                    value={hours.toString()}
                                    onValueChange={(v) => setTime(Number.parseInt(v), minutes)}
                                >
                                    <SelectTrigger className="h-8 border-none bg-transparent focus:ring-0">
                                        <SelectValue placeholder="HH" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60">
                                        {Array.from({ length: 24 }).map((_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                {i.toString().padStart(2, '0')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="text-muted-foreground">:</span>
                                <Select
                                    value={minutes.toString()}
                                    onValueChange={(v) => setTime(hours, Number.parseInt(v))}
                                >
                                    <SelectTrigger className="h-8 border-none bg-transparent focus:ring-0">
                                        <SelectValue placeholder="MM" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-60">
                                        {Array.from({ length: 60 }).map((_, i) => (
                                            <SelectItem key={i} value={i.toString()}>
                                                {i.toString().padStart(2, '0')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                    <div className="p-2 pt-0 flex justify-center">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full text-xs h-8"
                            onClick={() => {
                                const now = new Date();
                                if (mode === 'single') {
                                    onChange?.(now);
                                } else {
                                    onChange?.({ from: now, to: now });
                                }
                                setMonth(now);
                            }}
                        >
                            Now
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
