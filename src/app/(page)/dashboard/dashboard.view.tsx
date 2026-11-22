'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/custom/theme-toggle';
import { useAuth } from '@/hooks/react-query/useAuth';
import { useAuthStore } from '@/stores/auth.store';

/**
 * Signed-in home for non-admin users. The proxy (src/proxy.ts) already keeps
 * anonymous visitors out, so this view only renders the session.
 */
export default function DashboardView() {
    const { user, hasAdminPrivileges } = useAuthStore();
    const { logout, logoutState } = useAuth();

    return (
        <main className="min-h-screen bg-muted/40 text-foreground">
            <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
                <Link href="/" className="text-lg font-semibold">
                    Web Profile
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button
                        variant="outlineDanger"
                        onClick={() => logout()}
                        disabled={logoutState.isLoading}
                        className="gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </header>

            <section className="mx-auto max-w-3xl space-y-6 p-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Hello{user?.name ? `, ${user.name}` : ''}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">You are signed in.</p>
                </div>

                <div className="rounded-lg border border-border bg-card p-6 text-sm">
                    <dl className="grid grid-cols-[8rem_1fr] gap-y-2">
                        <dt className="text-muted-foreground">Email</dt>
                        <dd>{user?.email ?? '-'}</dd>
                        <dt className="text-muted-foreground">Role</dt>
                        <dd>{user?.role ?? '-'}</dd>
                    </dl>
                    {hasAdminPrivileges() && (
                        <Link href="/admin" className="mt-4 inline-block">
                            <Button>Open admin panel</Button>
                        </Link>
                    )}
                </div>
            </section>
        </main>
    );
}
