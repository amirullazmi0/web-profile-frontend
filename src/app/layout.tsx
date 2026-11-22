import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';
import QueryProvider from '@/provider/QueryProvider';
import MainProvider from '@/provider/main.provider';
import AuthSyncProvider from '@/provider/AuthSyncProvider';
import ThemeProvider from '@/provider/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Web Profile',
    description: 'Web Profile',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <ThemeProvider>
                    <NuqsAdapter>
                        <QueryProvider>
                            <Toaster position="top-center" />
                            <AuthSyncProvider>
                                <MainProvider>{children}</MainProvider>
                            </AuthSyncProvider>
                        </QueryProvider>
                    </NuqsAdapter>
                </ThemeProvider>
            </body>
        </html>
    );
}
