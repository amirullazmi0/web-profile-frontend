'use client';

import { useAuth } from '@/hooks/react-query/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { generatePassword } from '@/shared/generatePassword';
import {
    resetPasswordSchema,
    type ResetPasswordFormData,
} from './auth.reset-password.config';

const useAuthResetPassword = () => {
    const { resetPassword } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({
        resolver: yupResolver(resetPasswordSchema),
        mode: 'onChange',
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            setSuccessMessage('Reset token is missing. Please request a new link.');
            return;
        }

        return new Promise<void>((resolve) => {
            resetPassword(
                {
                    token,
                    new_password: data.newPassword,
                },
                {
                    onSuccess: (response) => {
                        setErrorMessage('');
                        setSuccessMessage(
                            response.message || 'Password updated successfully. Please sign in.',
                        );
                        reset();
                        setTimeout(() => router.push('/auth/sign-in'), 1200);
                    },
                    onError: (error) => {
                        const apiError = error as AxiosError<{ message?: string }>;
                        const validationError = (apiError.response?.data as {
                            error?: unknown;
                        })?.error;
                        const validationMessage = Array.isArray(validationError)
                            ? validationError.join(', ')
                            : undefined;
                        setSuccessMessage('');
                        setErrorMessage(
                            validationMessage ||
                                apiError.response?.data?.message ||
                                apiError.message ||
                                'Something went wrong',
                        );
                    },
                    onSettled: () => resolve(),
                },
            );
        });
    };

    const getPassword = () => {
        const password = generatePassword();
        setValue('newPassword', password, { shouldDirty: true, shouldValidate: true });
        setValue('confirmPassword', password, { shouldDirty: true, shouldValidate: true });
        trigger(['newPassword', 'confirmPassword']);
    };

    return {
        token,
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
        successMessage,
        errorMessage,
        getPassword,
    };
};

export default useAuthResetPassword;
