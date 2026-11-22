import { Input, type InputProps } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type DateFieldKind = 'date' | 'datetime' | 'month' | 'year' | 'time';

export interface DateFieldProps extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange'> {
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    kind?: DateFieldKind;
}

function normalizeYear(value: string) {
    return value.replace(/\D/g, '').slice(0, 4);
}

function DateField({ kind = 'date', value, defaultValue, onChange, className, ...props }: DateFieldProps) {
    const inputType = kind === 'datetime' ? 'datetime-local' : kind === 'year' ? 'text' : kind;
    const isYear = kind === 'year';

    return (
        <Input
            {...props}
            type={inputType}
            value={isYear ? normalizeYear(value ?? '') : value}
            defaultValue={isYear ? normalizeYear(defaultValue ?? '') : defaultValue}
            inputMode={isYear ? 'numeric' : props.inputMode}
            pattern={isYear ? '[0-9]{4}' : props.pattern}
            maxLength={isYear ? 4 : props.maxLength}
            className={cn('date-field', className)}
            onChange={(event) => {
                const nextValue = isYear ? normalizeYear(event.target.value) : event.target.value;
                onChange?.(nextValue);
            }}
        />
    );
}

function createDateField(kind: DateFieldKind, displayName: string) {
    const Field = (props: Omit<DateFieldProps, 'kind'>) => <DateField {...props} kind={kind} />;
    Field.displayName = displayName;
    return Field;
}

const DateInput = createDateField('date', 'DateInput');
const DateTimeInput = createDateField('datetime', 'DateTimeInput');
const MonthInput = createDateField('month', 'MonthInput');
const YearInput = createDateField('year', 'YearInput');
const TimeInput = createDateField('time', 'TimeInput');

const DateTimeField = DateTimeInput;
const MonthField = MonthInput;
const YearField = YearInput;
const TimeField = TimeInput;

export { DateField, DateInput, DateTimeInput, MonthInput, YearInput, TimeInput, DateTimeField, MonthField, YearField, TimeField };
