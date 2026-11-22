import Cookies from 'js-cookie';
import { useAuthStore } from '@/stores/auth.store';

const REFRESH_TOKEN_DAYS = 7;

const baseCookieOptions = {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
};

export const setAuthCookies = (
    accessToken: string,
    refreshToken?: string,
    expiresInSeconds?: number,
) => {
    Cookies.set('accessToken', accessToken, {
        ...baseCookieOptions,
        expires: expiresInSeconds
            ? new Date(Date.now() + expiresInSeconds * 1000)
            : REFRESH_TOKEN_DAYS,
    });

    if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, {
            ...baseCookieOptions,
            expires: REFRESH_TOKEN_DAYS,
        });
    }
};

/**
 * The role drives route gating in the Next middleware, so it has to outlive the
 * access token and stay for as long as the session can be refreshed.
 */
export const setUserRoleCookie = (role: string) => {
    Cookies.set('userRole', role, { ...baseCookieOptions, expires: REFRESH_TOKEN_DAYS });
};

export const clearAuthCookies = () => {
    Cookies.remove('accessToken', { path: '/' });
    Cookies.remove('refreshToken', { path: '/' });
    Cookies.remove('userRole', { path: '/' });
};

export const syncTokensToStore = (accessToken: string, refreshToken?: string) => {
    const { updateTokens } = useAuthStore.getState();
    updateTokens(accessToken, refreshToken);

};

export const syncAuthToStore = (user: unknown, accessToken: string, refreshToken: string) => {
    const { setAuth } = useAuthStore.getState();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setAuth(user as any, accessToken, refreshToken);

};

export const clearAuthFromStore = () => {
    const { clearAuth } = useAuthStore.getState();
    clearAuth();

};

export const getAuthState = () => {
    return useAuthStore.getState();
};
