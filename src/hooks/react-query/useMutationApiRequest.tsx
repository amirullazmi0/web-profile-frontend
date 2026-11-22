import { allMutations, AllMutationKeys } from '@/data-services/mutations';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';
import { constructUrl } from '@/data-services/utils/constructUrl';
import { AllQueryKeys } from '@/data-services/queries';
import { LoadingContext } from '@/provider/QueryProvider';
import { axiosInstance } from '@/lib/axios';
import { AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { AxiosErrorResponse } from '@/types/api/responses';

interface ApiResponse {
    message?: string;
}

/**
 * T = Response type (data yang dikembalikan dari API)
 * V = Request body type (data yang dikirim ke API, bisa object atau FormData untuk file upload)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type MutationApiRequestProps<T, V> = {
    key: AllMutationKeys;
    params?: Record<string, string> | (() => Record<string, string>);
    queries?: Record<string, string | number | boolean>;
    options?: {
        onSuccess?: (data?: T) => void;
        onError?: (error?: Error) => void;
        onSettled?: () => void;
    };
    config?: {
        showLoading?: boolean;
        successNotification?: boolean;
        errorNotification?: boolean;
        successNotificationMessage?: string;
        errorNotificationMessage?: string;
    };
};

const useMutationApiRequest = <T, V>({
    key,
    queries,
    options,
    params,
    config = {
        showLoading: true,
        successNotification: true,
        errorNotification: true,
    },
}: MutationApiRequestProps<T, V>) => {
    const queryClient = useQueryClient();
    const mutationConfig = allMutations[key];
    const { setLoading } = useContext(LoadingContext);

    const mutationFn = async (data: V): Promise<T> => {
        const isFormData = data instanceof FormData;

        let url = mutationConfig.url;
        const resolvedParams = typeof params === 'function' ? params() : params;
        url = constructUrl(url, { query: resolvedParams });

        const requestConfig: AxiosRequestConfig = {
            url: url,
            method: mutationConfig.method,
            data,
            params: queries,
        };
        const headers: Record<string, string> = {};
        if (isFormData) {
            headers['Content-Type'] = 'multipart/form-data';
        }
        requestConfig.headers = headers;

        const response = await axiosInstance(requestConfig);

        return response.data;
    };

    return useMutation<T, AxiosErrorResponse, V>({
        mutationFn,
        onMutate: () => {
            // start loading (if enabled)
            if (config.showLoading && typeof setLoading === 'function') setLoading(true);
        },
        onSuccess: (data) => {
            if (options?.onSuccess) options.onSuccess(data);
            if (mutationConfig.refetchQueries) {
                mutationConfig.refetchQueries.forEach((queryKey: AllQueryKeys) => {
                    queryClient.refetchQueries({ queryKey: [queryKey] });
                });
            }
            // Show success notification by default, unless explicitly disabled
            if (config?.successNotification ?? true) {
                toast.success(
                    config?.successNotificationMessage ??
                        (data as ApiResponse)?.message ??
                        '✅ Operation successful',
                );
            }
        },
        onError: (error) => {
            if (options?.onError) options.onError(error);
            // Show error notification by default, unless explicitly disabled
            if (config?.errorNotification ?? true) {
                const apiError = error.response?.data?.error;
                const validationMessage = Array.isArray(apiError)
                    ? apiError.join(', ')
                    : typeof apiError === 'string'
                      ? apiError
                      : undefined;
                toast.error(
                    config?.errorNotificationMessage ??
                        validationMessage ??
                        error.response?.data?.message ??
                        error.message ??
                        '❌ Something went wrong',
                );
            }
        },
        onSettled: () => {
            if (options?.onSettled) options.onSettled();
            // stop loading (if enabled)
            if (config.showLoading && typeof setLoading === 'function') setLoading(false);
        },
    });
};

export default useMutationApiRequest;
