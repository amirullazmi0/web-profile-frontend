'use client';
import { useState } from 'react';
import AdminSidebar from '@/components/admin/admin.sidebar';
import AdminNavbar from '@/components/admin/admin.navbar';

/**
 * Admin Layout
 *
 * Note: Authentication & authorization is handled by the Next.js proxy (src/proxy.ts)
 * This layout only handles UI/UX for admin panel
 * No need for auth checks here - the proxy already redirects unauthorized users
 */
export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-muted/40">
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen flex flex-col">
                {/* Navbar */}
                <AdminNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
            </div>
        </div>
    );
}
