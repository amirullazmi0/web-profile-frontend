'use client';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import { constructUrl } from '@/data-services/utils/constructUrl';
import { allQueries } from '@/data-services/queries';
import { LoadingContext } from '@/provider/QueryProvider';
import { axiosInstance } from '@/lib/axios';
import { AxiosErrorResponse } from '@/types/api/responses';
import { toast } from 'sonner';

type QueryApiRequestProps<T> = {
    key: keyof typeof allQueries;
    params?: Record<string, unknown>;
    queries?: Record<string, unknown>;
    options?: Omit<UseQueryOptions<T, AxiosErrorResponse>, 'queryKey' | 'queryFn'>;
    onSuccess?: (data: T) => void;
    config?: {
        showLoading?: boolean;
        successNotification?: boolean;
        errorNotification?: boolean;
        successNotificationMessage?: string;
        errorNotificationMessage?: string;
    };
};

const useQueryApiRequest = <T,>({
    key,
    params,
    queries,
    options,
    config = {
        showLoading: true,
        successNotification: false,
        errorNotification: true,
    },
    onSuccess,
}: QueryApiRequestProps<T>) => {
    const queryKey = [key, params, queries];
    const { setLoading } = useContext(LoadingContext);
    const queryFn = async (): Promise<T> => {
        let url = allQueries[key];
        url = constructUrl(url, {
            query: params as Record<string, string> | undefined,
        });

        const response = await axiosInstance.get(url, {
            params: queries,
        });

        return response.data;
    };

    const queryFetch = useQuery<T, AxiosErrorResponse>({
        queryKey,
        queryFn,
        ...options,
    });

    useEffect(() => {
        if (config.showLoading) {
            if (queryFetch.isLoading) {
                setLoading(true);
            }
            if (queryFetch.isError || queryFetch.isSuccess) {
                setLoading(false);
            }
        }

        if (queryFetch.isError) {
            // Query error notification is OFF by default
            if (config.errorNotification) {
                const apiError = queryFetch.error.response?.data?.error;
                const validationMessage = Array.isArray(apiError)
                    ? apiError.join(', ')
                    : typeof apiError === 'string'
                      ? apiError
                      : undefined;
                const errMsg =
                    config.errorNotificationMessage ??
                    validationMessage ??
                    queryFetch.error.response?.data?.message ??
                    queryFetch.error?.message ??
                    '❌ Failed to fetch data';
                toast.error(errMsg);
            }
        }

        if (queryFetch.isSuccess) {
            if (onSuccess && queryFetch.data) {
                onSuccess(queryFetch.data);
            }

            // Query success notification is OFF by default
            if (config.successNotification) {
                const msg =
                    config.successNotificationMessage ??
                    (queryFetch.data &&
                    typeof queryFetch.data === 'object' &&
                    'message' in queryFetch.data
                        ? (queryFetch.data as { message?: string }).message
                        : undefined) ??
                    '✅ Data loaded successfully';
                toast.success(msg);
            }
        }
    }, [
        queryFetch.isLoading,
        queryFetch.isError,
        queryFetch.isSuccess,
        queryFetch.data,
        queryFetch.error,
        config,
        onSuccess,
        setLoading,
    ]);

    return queryFetch;
};

export default useQueryApiRequest;
