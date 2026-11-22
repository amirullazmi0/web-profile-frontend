import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AlertTriangle, CheckCircle, Info, Terminal, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

const alertVariants = cva(
    'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',
    {
        variants: {
            variant: {
                default: 'bg-background text-foreground',
                destructive:
                    'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
                primary:
                    'border-primary/50 text-primary dark:border-primary [&>svg]:text-primary',
                warning:
                    'border-warning/50 text-warning dark:border-warning [&>svg]:text-warning',
                info: 'border-info/50 text-info dark:border-info [&>svg]:text-info',
                danger: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
                success:
                    'border-success/50 text-success dark:border-success [&>svg]:text-success',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h5
            ref={ref}
            className={cn('mb-1 font-medium leading-none tracking-tight', className)}
            {...props}
        />
    ),
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
));
AlertDescription.displayName = 'AlertDescription';

interface CustomAlertProps extends React.ComponentProps<typeof Alert> {
    icon?: React.ElementType;
    title?: string;
    description?: React.ReactNode;
}

function CustomAlert({
    variant,
    icon: Icon,
    title,
    description,
    children,
    className,
    ...props
}: CustomAlertProps) {
    const getIcon = () => {
        if (Icon) return <Icon className="h-4 w-4" />;
        switch (variant) {
            case 'destructive':
            case 'danger':
                return <XCircle className="h-4 w-4" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4" />;
            case 'success':
                return <CheckCircle className="h-4 w-4" />;
            case 'info':
            case 'primary':
                return <Info className="h-4 w-4" />;
            default:
                return <Terminal className="h-4 w-4" />;
        }
    };

    return (
        <Alert variant={variant} className={className} {...props}>
            {getIcon()}
            {title && <AlertTitle>{title}</AlertTitle>}
            <AlertDescription>
                {description}
                {children}
            </AlertDescription>
        </Alert>
    );
}

function StackedAlert({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={cn('flex flex-col gap-2', className)}>{children}</div>;
}

export { Alert, AlertTitle, AlertDescription, CustomAlert, StackedAlert };
