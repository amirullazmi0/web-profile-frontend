import { useAuthStore } from '@/stores/auth.store';

export default function useAdminHook() {
    const { user, isAdmin, isSuperAdmin, hasAdminPrivileges } = useAuthStore();
    return {
        user,
        isAdmin: isAdmin(),
        isSuperAdmin: isSuperAdmin(),
        hasAdminPrivileges: hasAdminPrivileges(),
    };
}
