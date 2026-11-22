import { toast } from 'sonner';
import axios from 'axios';
import cookies from 'js-cookie';
import { syncTokensToStore, clearAuthFromStore, setAuthCookies, clearAuthCookies } from './auth-sync';
import { AuthResponse } from '@/types/auth';

// Get token from cookies
const getAuthToken = () => {
    const token = cookies.get('accessToken');
    return token || '';
};

// Create Axios instance
export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to inject token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        throw error;
    },
);

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Public resources that should skip session alerts or token refresh logic
const PUBLIC_PATHS = [
    '/',
    '/auth/sign-in',
    '/auth/sign-up',
    '/auth/forgot-password',
    '/auth/reset-password',
];

// API calls whose 401 must not trigger a refresh. /auth/refresh is here so a
// rejected refresh fails fast instead of waiting in the queue for itself.
const SKIP_REFRESH_URLS = [
    '/auth/login',
    '/auth/register',
    '/auth/refresh',
    '/auth/logout',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/resend-verification',
];

const shouldSkipRefresh = (url?: string) => SKIP_REFRESH_URLS.some((path) => url?.includes(path));

const redirectToLogin = () => {
    clearAuthFromStore();
    clearAuthCookies();

    if (
        globalThis.window !== undefined &&
        !PUBLIC_PATHS.includes(globalThis.window.location.pathname)
    ) {
        globalThis.window.location.href = '/auth/sign-in';
    }
};

const showSessionExpiredAlert = () => {
    if (
        globalThis.window === undefined ||
        PUBLIC_PATHS.includes(globalThis.window.location.pathname)
    )
        return;

    toast.error('Session expired. Please sign in again.');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleQueuedRequest = (originalRequest: any) => {
    return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
    })
        .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
        })
        .catch((err) => {
            throw err;
        });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleRefreshToken = async (originalRequest: any) => {
    const refreshToken = cookies.get('refreshToken');

    if (!refreshToken) {
        processQueue(new Error('No refresh token'), null);
        redirectToLogin();
        throw new Error('No refresh token');
    }

    try {
        const response = await axiosInstance.post(
            '/auth/refresh',
            { refresh_token: refreshToken },
            {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            },
        );

        const newAccessToken =
            response.data.data.accessToken || (response.data.data as AuthResponse).access_token;
        const newRefreshToken =
            response.data.data.refreshToken || (response.data.data as AuthResponse).refresh_token;

        if (response.data.success && newAccessToken) {
            setAuthCookies(
                newAccessToken,
                newRefreshToken,
                (response.data.data as AuthResponse).expires_in,
            );

            axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            syncTokensToStore(newAccessToken, newRefreshToken);
            processQueue(null, newAccessToken);

            return axiosInstance(originalRequest);
        }

        throw new Error('Refresh token expired');
    } catch (refreshError) {
        processQueue(refreshError as Error, null);
        redirectToLogin();

        if (globalThis.window !== undefined && !PUBLIC_PATHS.includes(globalThis.window.location.pathname)) {
            showSessionExpiredAlert();
        }

        throw refreshError;
    }
};

// Add response interceptor to handle token expiration and auto-refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if error is 401 and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Skip refresh for login, register, and refresh endpoints
            if (shouldSkipRefresh(originalRequest.url)) {
                throw error;
            }

            if (isRefreshing) {
                return handleQueuedRequest(originalRequest);
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                return await handleRefreshToken(originalRequest);
            } finally {
                isRefreshing = false;
            }
        }

        throw error;
    },
);
