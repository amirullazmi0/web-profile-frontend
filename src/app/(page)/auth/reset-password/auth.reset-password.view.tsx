'use client';

import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import useAuthResetPassword from './auth.reset-password.hook';

const AuthResetPasswordView = () => {
    const {
        token,
        register,
        handleSubmit,
        onSubmit,
        errors,
        isSubmitting,
        successMessage,
        errorMessage,
        getPassword,
    } = useAuthResetPassword();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 p-4">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden p-5">
                <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden">
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                        <div className="mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mb-4">
                                <KeyRound className="w-6 h-6" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Set a new password
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Use the token from your reset email to create a new password.
                            </p>
                        </div>

                        {!token && (
                            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                                Reset token is missing from the URL.
                            </div>
                        )}

                        {errorMessage && (
                            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                                {errorMessage}
                            </div>
                        )}

                        {successMessage ? (
                            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                                <p className="text-sm font-medium text-emerald-800">
                                    {successMessage}
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
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="newPassword"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        New password
                                    </Label>
                                    <PasswordInput
                                        id="newPassword"
                                        placeholder="••••••••"
                                        {...register('newPassword')}
                                        className={`h-12 ${
                                            errors.newPassword ? 'border-red-500' : ''
                                        }`}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="mt-2 gap-2"
                                        onClick={getPassword}
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        Generate Password
                                    </Button>
                                    {errors.newPassword && (
                                        <p className="text-sm text-red-500">
                                            {errors.newPassword.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="confirmPassword"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Confirm password
                                    </Label>
                                    <PasswordInput
                                        id="confirmPassword"
                                        placeholder="••••••••"
                                        {...register('confirmPassword')}
                                        className={`h-12 ${
                                            errors.confirmPassword ? 'border-red-500' : ''
                                        }`}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-500">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={isSubmitting || !token}
                                    width="full"
                                >
                                    {isSubmitting ? 'Updating password...' : 'Reset password'}
                                </Button>

                                <p className="text-sm text-center text-gray-600">
                                    <Link
                                        href="/auth/sign-in"
                                        className="font-semibold text-gray-900 hover:text-emerald-600"
                                    >
                                        Back to sign in
                                    </Link>
                                </p>
                            </form>
                        )}
                    </div>

                    <div className="hidden md:block relative bg-gradient-to-br from-amber-300 via-orange-400 to-orange-500 overflow-hidden" />
                </div>
            </div>
        </div>
    );
};

export default AuthResetPasswordView;
