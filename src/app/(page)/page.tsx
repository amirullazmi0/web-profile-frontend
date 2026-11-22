import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/custom/theme-toggle';

export default function HomePage() {
    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="flex items-center justify-between px-6 py-4">
                <span className="text-lg font-semibold">Web Profile</span>
                <ThemeToggle />
            </header>

            <section className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-24 text-center">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Web Profile</h1>
                <p className="mt-4 text-muted-foreground">
                    Next.js frontend with sign-in, sign-up, email verification, password reset and
                    an admin panel, wired to the backend API.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <Link href="/auth/sign-in">
                        <Button>Sign in</Button>
                    </Link>
                    <Link href="/auth/sign-up">
                        <Button variant="outline">Create account</Button>
                    </Link>
                </div>
            </section>
        </main>
    );
}
