'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import useAuthForgotPassword from './auth.forgot-password.hook';

const AuthForgotPasswordView = () => {
    const {
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
        successMessage,
        errorMessage,
        showResendVerification,
        handleResendVerification,
        isResendingVerification,
    } = useAuthForgotPassword();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden p-5">
                <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden">
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Reset your password
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Enter your email and we&apos;ll send a reset link.
                            </p>
                        </div>

                        {successMessage ? (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                <p className="text-sm font-medium text-emerald-800">
                                    {successMessage}
                                </p>
                                <p className="mt-2 text-sm text-emerald-700">
                                    Follow the link in your inbox to continue.
                                </p>
                                <Button
                                    asChild
                                    variant="primary"
                                    width="full"
                                    className="mt-4 gap-2"
                                >
                                    <Link href="/auth/sign-in">
                                        <ArrowLeft className="w-4 h-4" />
                                        Back to sign in
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                {errorMessage && (
                                    <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4">
                                        <p className="text-sm font-medium text-red-800">
                                            {errorMessage}
                                        </p>
                                        {showResendVerification && (
                                            <Button
                                                type="button"
                                                variant="outlinePrimary"
                                                className="mt-3"
                                                disabled={isResendingVerification}
                                                onClick={handleResendVerification}
                                            >
                                                {isResendingVerification
                                                    ? 'Sending verification email...'
                                                    : 'Resend verification email'}
                                            </Button>
                                        )}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-medium text-gray-700"
                                        >
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            {...register('email')}
                                            className={`h-12 ${errors.email ? 'border-red-500' : ''}`}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-500">
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        disabled={isSubmitting}
                                        width="full"
                                    >
                                        {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
                                    </Button>

                                    <p className="text-sm text-center text-gray-600">
                                        Remember your password?{' '}
                                        <Link
                                            href="/auth/sign-in"
                                            className="font-semibold text-gray-900 hover:text-emerald-600"
                                        >
                                            Sign in
                                        </Link>
                                    </p>
                                </form>
                            </>
                        )}
                    </div>

                    <div className="hidden md:block relative bg-gradient-to-br from-amber-300 via-orange-400 to-orange-500 overflow-hidden" />
                </div>
            </div>
        </div>
    );
};

export default AuthForgotPasswordView;
