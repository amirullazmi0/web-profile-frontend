import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { allMutations } from '@/data-services/mutations';
import { constructUrl } from '@/data-services/utils/constructUrl';
import {
    LoginRequest,
    RegisterRequest,
    ForgetPasswordRequest,
    ResetPasswordRequest,
    AuthResponse,
    GlobalAuthResponse,
    User,
} from '@/types/auth';
import { axiosInstance } from '@/lib/axios';
import { setAuthCookies, setUserRoleCookie, clearAuthCookies } from '@/lib/auth-sync';
import { useAuthStore } from '@/stores/auth.store';
import { toast } from 'sonner';

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * A session survives an expired access token: the axios interceptor renews it
 * from the refresh token mid-request. Checking only for the access token would
 * report a live session as logged out and skip the call that triggers the renewal.
 */
const hasSession = () => Boolean(Cookies.get('accessToken') || Cookies.get('refreshToken'));

/**
 * Where to land after sign-in: the ?redirect= path the proxy added (same-origin
 * paths only), otherwise the role's home.
 */
export const getPostLoginPath = (role?: string) => {
    const isAdmin = role === 'ADMIN' || role === 'SUPERADMIN';
    const redirect = new URLSearchParams(globalThis.window?.location.search ?? '').get('redirect');
    if (redirect?.startsWith('/') && !redirect.startsWith('//')) {
        if (!redirect.startsWith('/admin') || isAdmin) return redirect;
    }
    return isAdmin ? '/admin' : '/dashboard';
};

export const useAuth = () => {
    const queryClient = useQueryClient();
    const { setAuth, clearAuth } = useAuthStore();

    // Login mutation
    const loginMutation = useMutation<GlobalAuthResponse<AuthResponse>, Error, LoginRequest>({
        mutationFn: async (credentials: LoginRequest) => {
            const url = constructUrl(API_BASE_URL + allMutations.login.url);
            const response = await axiosInstance.post(url, credentials);
            return response.data;
        },
        onSuccess: (data) => {
            const accessToken = data.data.access_token;
            const refreshToken = data.data.refresh_token;

            // Store tokens in cookies
            if (data.success && accessToken) {
                setAuthCookies(accessToken, refreshToken, data.data.expires_in);

                // Store user role in cookie for middleware access
                setUserRoleCookie(data.data.user.role);

                // Store auth data in Zustand store
                setAuth(data.data.user, accessToken, refreshToken);

                // Store user data in React Query cache
                queryClient.setQueryData(['user'], data.data.user);

                toast.success('Login success');
                globalThis.window.location.href = getPostLoginPath(data.data.user.role);
            } else {
                toast.error('No access token found in response');
            }
        },
        onError: (error: Error) => {
            const err: AxiosError<{ message: string }> = error as unknown as AxiosError<{
                message: string;
            }>;
            toast.error(err.response?.data.message);
        },
    });

    // Register mutation
    const registerMutation = useMutation<GlobalAuthResponse<AuthResponse>, Error, RegisterRequest>({
        mutationFn: async (userData: RegisterRequest) => {
            const url = constructUrl(API_BASE_URL + allMutations.register.url);
            const response = await axiosInstance.post(url, userData);
            return response.data;
        },
        onSuccess: (data) => {
            if (data.success) {
                toast.success('Register success, please check your email for verification');
                globalThis.window.location.href = '/auth/sign-in';
            } else {
                toast.error(data.message);
            }
        },
        onError: (error) => {
            const err: AxiosError<{ message: string }> = error as unknown as AxiosError<{
                message: string;
            }>;
            toast.error(err.response?.data.message);
        },
    });

    // Local teardown runs whether or not the backend call succeeded: the user
    // asked to be logged out, so the session goes away regardless.
    const finishLogout = () => {
        clearAuth();
        clearAuthCookies();
        queryClient.clear();
        globalThis.window.location.href = '/auth/sign-in';
    };

    // Logout mutation
    const logoutMutation = useMutation<GlobalAuthResponse<{ message: string }>, Error, void>({
        mutationFn: async () => {
            const url = constructUrl(API_BASE_URL + allMutations.logout.url);
            const response = await axiosInstance.post(url);
            return response.data;
        },
        onSuccess: finishLogout,
        onError: finishLogout,
    });

    // Forget password mutation
    const forgetPasswordMutation = useMutation<GlobalAuthResponse<null>, Error, ForgetPasswordRequest>(
        {
        mutationFn: async (data: ForgetPasswordRequest) => {
            const url = constructUrl(API_BASE_URL + allMutations.forgetPassword.url);
            const response = await axiosInstance.post(url, data);
            return response.data;
        },
    });

    const resendVerificationMutation = useMutation<
        GlobalAuthResponse<null>,
        Error,
        ForgetPasswordRequest
    >({
        mutationFn: async (data: ForgetPasswordRequest) => {
            const url = constructUrl(API_BASE_URL + allMutations.resendVerification.url);
            const response = await axiosInstance.post(url, data);
            return response.data;
        },
    });

    // Reset password mutation
    const resetPasswordMutation = useMutation<GlobalAuthResponse<null>, Error, ResetPasswordRequest>({
        mutationFn: async (data: ResetPasswordRequest) => {
            const url = constructUrl(API_BASE_URL + allMutations.resetPassword.url);
            const response = await axiosInstance.post(url, data);
            return response.data;
        },
    });

    // Get current user query - using /users/profile
    const userQuery = useQuery<User | null>({
        queryKey: ['user'],
        queryFn: async () => {
            // Return null if there is no session at all
            if (!hasSession()) {
                return null;
            }

            try {
                const response = await axiosInstance.get('/users/profile');

                if (response.data.success && response.data.data) {
                    return response.data.data;
                }
                return null;
            } catch {
                return null;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: false,
        refetchOnWindowFocus: false,
        enabled: hasSession(), // Only run if a session exists
    });

    // Sync user from React Query to Zustand store whenever user data changes
    useEffect(() => {
        if (userQuery.data) {
            const accessToken = Cookies.get('accessToken');
            const refreshToken = Cookies.get('refreshToken');

            if (hasSession()) {
                setAuth(userQuery.data, accessToken || '', refreshToken || '');

                // Update userRole cookie if not set or different
                const currentRoleCookie = Cookies.get('userRole');
                if (currentRoleCookie !== userQuery.data.role) {
                    setUserRoleCookie(userQuery.data.role);
                }
            }
        } else if (!hasSession()) {
            // Clear Zustand if no token
            clearAuth();
        }
    }, [userQuery.data, setAuth, clearAuth]);

    // Helper functions
    const isAuthenticated = () => {
        return !!userQuery.data && !userQuery.isError;
    };

    const isLoading = () => {
        return (
            loginMutation.isPending ||
            registerMutation.isPending ||
            logoutMutation.isPending ||
            userQuery.isLoading
        );
    };

    return {
        // Mutations
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
        forgetPassword: forgetPasswordMutation.mutate,
        resendVerification: resendVerificationMutation.mutate,
        resetPassword: resetPasswordMutation.mutate,

        // States
        loginState: {
            isLoading: loginMutation.isPending,
            isError: loginMutation.isError,
            error: loginMutation.error,
            isSuccess: loginMutation.isSuccess,
            data: loginMutation.data,
        },

        registerState: {
            isLoading: registerMutation.isPending,
            isError: registerMutation.isError,
            error: registerMutation.error,
            isSuccess: registerMutation.isSuccess,
            data: registerMutation.data,
        },

        logoutState: {
            isLoading: logoutMutation.isPending,
            isError: logoutMutation.isError,
            error: logoutMutation.error,
            isSuccess: logoutMutation.isSuccess,
        },

        forgetPasswordState: {
            isLoading: forgetPasswordMutation.isPending,
            isError: forgetPasswordMutation.isError,
            error: forgetPasswordMutation.error,
            isSuccess: forgetPasswordMutation.isSuccess,
            data: forgetPasswordMutation.data,
        },

        resendVerificationState: {
            isLoading: resendVerificationMutation.isPending,
            isError: resendVerificationMutation.isError,
            error: resendVerificationMutation.error,
            isSuccess: resendVerificationMutation.isSuccess,
            data: resendVerificationMutation.data,
        },

        resetPasswordState: {
            isLoading: resetPasswordMutation.isPending,
            isError: resetPasswordMutation.isError,
            error: resetPasswordMutation.error,
            isSuccess: resetPasswordMutation.isSuccess,
            data: resetPasswordMutation.data,
        },

        // User data
        user: userQuery.data,
        userLoading: userQuery.isLoading,
        userError: userQuery.error,
        refetchUser: userQuery.refetch,

        // Helper functions
        isAuthenticated,
        isLoading,

        // Reset functions
        resetLoginState: () => loginMutation.reset(),
        resetRegisterState: () => registerMutation.reset(),
        resetForgetPasswordState: () => forgetPasswordMutation.reset(),
        resetResendVerificationState: () => resendVerificationMutation.reset(),
        resetResetPasswordState: () => resetPasswordMutation.reset(),
    };
};
