'use client';
import { Button } from '@/components/ui/button';
import { Input, PasswordInput } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useAuthSignUp from './auth.sign-up.hook';

const AuthSignUpView = () => {
    const { register, handleSubmit, onSubmit, errors, isSubmitting } = useAuthSignUp();

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-900 via-green-800 to-emerald-950 p-4">
            <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Side - Illustration */}
                <div className="hidden md:block relative bg-linear-to-br from-emerald-400 via-green-500 to-teal-600 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center p-12" />
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account 🌱</h1>
                        <p className="text-gray-500 text-sm">Join us and start your journey.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name Input */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Full Name
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="John Doe"
                                {...register('name')}
                                className={`h-12 ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
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
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <PasswordInput
                                id="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className={`h-12 ${errors.password ? 'border-red-500' : ''}`}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-gray-700"
                            >
                                Confirm Password
                            </Label>
                            <PasswordInput
                                id="confirmPassword"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                                className={`h-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                            />
                            {errors.confirmPassword && (
                                <p className="text-sm text-red-500">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Terms checkbox */}
                        <div className="flex items-start gap-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4 mt-0.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                required
                            />
                            <span className="text-sm text-gray-600">
                                I agree to the{' '}
                                <a
                                    href="/terms"
                                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a
                                    href="/privacy"
                                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                                >
                                    Privacy Policy
                                </a>
                            </span>
                        </div>

                        {/* Sign Up Button */}
                        <Button
                            type="submit"
                            variant={'primary'}
                            disabled={isSubmitting}
                            width={'full'}
                        >
                            {isSubmitting ? 'Creating account...' : 'Sign Up'}
                        </Button>

                        {/* Sign In Link */}
                        <p className="text-sm text-center text-gray-600">
                            Already have an account?{' '}
                            <a
                                href="/auth/sign-in"
                                className="font-semibold text-gray-900 hover:text-emerald-600"
                            >
                                Sign In
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AuthSignUpView;
