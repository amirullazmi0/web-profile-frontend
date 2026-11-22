'use client';
import { ReactNode } from 'react';

/**
 * App-wide chrome. /admin and /auth render their own layouts; add a public
 * navbar/footer here when the app gets one.
 */
export default function MainProvider({ children }: Readonly<{ children: ReactNode }>) {
    return <>{children}</>;
}
