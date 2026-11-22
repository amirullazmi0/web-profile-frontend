'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-900 via-green-800 to-emerald-950 p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="relative inline-block">
                        <h1 className="text-9xl font-bold text-gray-200">404</h1>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-linear-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-16 h-16 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Oops! Page Not Found</h2>
                    <p className="text-gray-600 text-lg">
                        {`The page you're looking for seems to have wandered off
                        into the tea fields. Let's get you back on track!`}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button className="w-full sm:w-auto h-12 bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-medium shadow-lg px-8">
                            Go Home
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto h-12 border-gray-300 hover:bg-gray-50 px-8"
                    >
                        Go Back
                    </Button>
                </div>

                {/* Decorative elements */}
                <div className="mt-12 flex justify-center gap-4 opacity-50">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" />
                    <div
                        className="w-3 h-3 bg-green-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                    />
                    <div
                        className="w-3 h-3 bg-teal-500 rounded-full animate-bounce"
                        style={{ animationDelay: '0.4s' }}
                    />
                </div>
            </div>
        </div>
    );
}
