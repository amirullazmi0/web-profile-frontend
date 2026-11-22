'use client';

import useAdminHook from './admin.hook';

export default function AdminView() {
    const { user, isSuperAdmin } = useAdminHook();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Welcome back{user?.name ? `, ${user.name}` : ''}.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
                {isSuperAdmin
                    ? 'Manage accounts from Master → Users. Add new modules to the sidebar in src/components/admin/admin.list.tsx.'
                    : 'Add new admin modules under src/app/(page)/admin/(pages)/ and list them in src/components/admin/admin.list.tsx.'}
            </div>
        </div>
    );
}
