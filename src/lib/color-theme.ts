/**
 * Semantic class tokens used across the application.
 *
 * Keep the class names literal so Tailwind can discover and generate them.
 * The actual color values live in globals.css as CSS variables.
 */
export const colorTheme = {
    brand: {
        background: 'bg-primary',
        backgroundHover: 'hover:bg-primary/90',
        text: 'text-primary',
        border: 'border-primary',
        ring: 'ring-primary',
        foreground: 'text-primary-foreground',
    },
    surface: {
        page: 'bg-background',
        card: 'bg-card text-card-foreground',
        muted: 'bg-muted text-muted-foreground',
        border: 'border-border',
        input: 'border-input',
    },
    text: {
        primary: 'text-foreground',
        muted: 'text-muted-foreground',
        inverse: 'text-primary-foreground',
    },
    status: {
        success: {
            background: 'bg-success',
            softBackground: 'bg-success/10',
            text: 'text-success',
            border: 'border-success',
        },
        warning: {
            background: 'bg-warning',
            softBackground: 'bg-warning/10',
            text: 'text-warning',
            border: 'border-warning',
        },
        info: {
            background: 'bg-info',
            softBackground: 'bg-info/10',
            text: 'text-info',
            border: 'border-info',
        },
        danger: {
            background: 'bg-destructive',
            softBackground: 'bg-destructive/10',
            text: 'text-destructive',
            border: 'border-destructive',
        },
    },
} as const;

export type ColorTheme = typeof colorTheme;
