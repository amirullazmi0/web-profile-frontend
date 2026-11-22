'use client';

import { useAuth } from '@/hooks/react-query/useAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { AxiosError } from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { forgotPasswordSchema, type ForgotPasswordFormData } from './auth.forgot-password.config';

const useAuthForgotPassword = () => {
    const { forgetPassword, resendVerification, resendVerificationState } = useAuth();
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [pendingEmail, setPendingEmail] = useState('');
    const [showResendVerification, setShowResendVerification] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: yupResolver(forgotPasswordSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        return new Promise<void>((resolve) => {
            forgetPassword(data, {
                onSuccess: (response) => {
                    setErrorMessage('');
                    setShowResendVerification(false);
                    setPendingEmail(data.email);
                    setSuccessMessage(
                        response.message || 'Check your email for the password reset link.',
                    );
                    reset();
                },
                onError: (error) => {
                    const apiError = error as AxiosError<{ message?: string }>;
                    const validationError = (apiError.response?.data as { error?: unknown })?.error;
                    const validationMessage = Array.isArray(validationError)
                        ? validationError.join(', ')
                        : undefined;
                    const message =
                        validationMessage ||
                        apiError.response?.data?.message ||
                        apiError.message ||
                        'Something went wrong';

                    setSuccessMessage('');
                    setErrorMessage(message);
                    setPendingEmail(data.email);
                    setShowResendVerification(message.toLowerCase().includes('verify your email'));
                },
                onSettled: () => resolve(),
            });
        });
    };

    const handleResendVerification = async () => {
        if (!pendingEmail) return;

        resendVerification(
            { email: pendingEmail },
            {
                onSuccess: (response) => {
                    setErrorMessage('');
                    setShowResendVerification(false);
                    setSuccessMessage(response.message || 'Verification email has been sent.');
                },
            },
        );
    };

    return {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
        successMessage,
        errorMessage,
        showResendVerification,
        pendingEmail,
        handleResendVerification,
        isResendingVerification: resendVerificationState.isLoading,
    };
};

export default useAuthForgotPassword;
