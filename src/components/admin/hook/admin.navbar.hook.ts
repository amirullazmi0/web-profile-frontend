import { useAuthStore } from '@/stores/auth.store';
import { useAuth } from '@/hooks/react-query/useAuth';

/**
 * Custom hook for admin navbar to access user data and role helpers
 * Uses Zustand store as primary source of truth, with React Query as fallback
 */
export default function useAdminNavbar() {
    // Get user from Zustand store (primary source)
    const { user, isAdmin, isSuperAdmin, hasAdminPrivileges } = useAuthStore();

    // Get logout function from React Query
    const { logout } = useAuth();

    return {
        // User data
        user,

        // Role helpers
        isAdmin: isAdmin(),
        isSuperAdmin: isSuperAdmin(),
        hasAdminPrivileges: hasAdminPrivileges(),

        // Actions
        logout,
    };
}
