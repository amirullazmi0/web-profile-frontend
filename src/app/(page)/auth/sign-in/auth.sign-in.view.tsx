'use client';
import { Button } from '@/components/ui/button';
import { Input, PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuthSignIn from './auth.sign-in.hook';

const AuthSignInView = () => {
    const { register, handleSubmit, onSubmit, errors, isSubmitting } = useAuthSignIn();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950 p-4">
            <div className="w-full max-w-5xl  gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden p-5">
                <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden">
                    <div className="p-8 md:p-12 flex flex-col justify-center overflow-hidden">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome back 👋
                            </h1>
                            <p className="text-gray-500 text-sm">Please enter your details.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {/* Email Input */}
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
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    placeholder="••••••••"
                                    {...register('password')}
                                    className={`h-12 ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="text-gray-600">Remember for 30 days</span>
                                </label>
                                <a
                                    href="/auth/forgot-password"
                                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            {/* Login Button */}
                            <Button
                                type="submit"
                                variant={'primary'}
                                disabled={isSubmitting}
                                width={'full'}
                            >
                                {isSubmitting ? 'Signing in...' : 'Log In'}
                            </Button>

                            {/* Sign Up Link */}
                            <p className="text-sm text-center text-gray-600">
                                {`Don't have an account? `}
                                <a
                                    href="/auth/sign-up"
                                    className="font-semibold text-gray-900 hover:text-emerald-600"
                                >
                                    Sign Up
                                </a>
                            </p>
                        </form>
                    </div>

                    <div className="hidden md:block relative bg-gradient-to-br from-amber-300 via-orange-400 to-orange-500 overflow-hidden" />
                </div>
            </div>
        </div>
    );
};

export default AuthSignInView;
