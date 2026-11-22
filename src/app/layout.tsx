import type { Metadata } from 'next';
import { Archivo_Black, Geist, Geist_Mono, Space_Mono } from 'next/font/google';
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

const archivo = Archivo_Black({
    variable: '--font-archivo',
    weight: '400',
    subsets: ['latin'],
});

const spaceMono = Space_Mono({
    variable: '--font-space-mono',
    weight: ['400', '700'],
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Amirull Azmi — Full Stack Developer',
    description:
        'Portfolio island of Amirull Azmi, Full Stack Developer in Jakarta: drive around fleet telematics, AI, automation, Web3, IoT and web projects.',
    openGraph: {
        title: 'Amirull Azmi — Full Stack Developer',
        description: 'Drive around a 3D island of projects: Go, TypeScript, NestJS, Next.js, Python and more.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${archivo.variable} ${spaceMono.variable} antialiased`}
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
