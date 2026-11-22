'use client';
import { useAuth } from '@/hooks/react-query/useAuth';

/**
 * AuthSyncProvider - Automatically syncs user data to Zustand store on app load
 * This component should be placed high in the component tree (e.g., in root layout)
 * to ensure user authentication state is loaded and synced to Zustand store
 */
export default function AuthSyncProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // This will trigger the user profile fetch and sync to Zustand
    useAuth();

    return <>{children}</>;
}
