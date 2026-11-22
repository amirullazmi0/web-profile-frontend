import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types/auth';
import { Role } from '@/types/enums/role.enum';

export interface AuthState {
    // State
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;

    // Actions
    setAuth: (user: User, accessToken: string, refreshToken: string) => void;
    setUser: (user: User) => void;
    clearAuth: () => void;
    updateTokens: (accessToken: string, refreshToken?: string) => void;

    // Helper functions
    isAdmin: () => boolean;
    isSuperAdmin: () => boolean;
    hasAdminPrivileges: () => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            // Initial state
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            // Actions
            setAuth: (user, accessToken, refreshToken) => {
                set({
                    user,
                    accessToken,
                    refreshToken,
                    isAuthenticated: true,
                });
            },

            setUser: (user) => {
                set({
                    user,
                    isAuthenticated: true,
                });
            },

            clearAuth: () => {
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false,
                });
            },

            updateTokens: (accessToken, refreshToken) => {
                set((state) => ({
                    accessToken,
                    refreshToken: refreshToken || state.refreshToken,
                }));
            },

            // Helper functions
            isAdmin: () => {
                const { user } = get();
                return user?.role === Role.ADMIN;
            },

            isSuperAdmin: () => {
                const { user } = get();
                return user?.role === Role.SUPERADMIN;
            },

            hasAdminPrivileges: () => {
                const { user } = get();
                return user?.role === Role.ADMIN || user?.role === Role.SUPERADMIN;
            },
        }),
        {
            name: 'web-profile-auth-storage', // localStorage key
            partialize: (state) => ({
                // Only persist user data, NOT tokens (tokens in cookies)
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);
