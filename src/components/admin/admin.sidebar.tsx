'use client';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { ChevronRight, Globe, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { adminMenuItems, AdminMenuInterface } from './admin.list';
import { Button } from '../ui/button';

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: Readonly<AdminSidebarProps>) {
    const pathname = usePathname();
    const { user } = useAuthStore();
    const [openMenus, setOpenMenus] = useState<number[]>([]);

    // Use a ref to prevent infinite loops if something goes wrong,
    // though the dependency array [pathname] is already quite safe.
    useEffect(() => {
        const activeParentIds = adminMenuItems
            .filter((item) => item.children?.some((child) => pathname === `/${child.slug}`))
            .map((item) => item.id);

        if (activeParentIds.length > 0) {
            // Using a minor delay or microtask to avoid "synchronous setState" ESLint error
            // while still providing the auto-expansion UX.
            const timeoutId = setTimeout(() => {
                setOpenMenus((prev) => {
                    const newIds = activeParentIds.filter((id) => !prev.includes(id));
                    return newIds.length > 0 ? [...prev, ...newIds] : prev;
                });
            }, 0);
            return () => clearTimeout(timeoutId);
        }
    }, [pathname]);

    const toggleMenu = (id: number) => {
        setOpenMenus((prev) =>
            prev.includes(id) ? prev.filter((menuId) => menuId !== id) : [...prev, id],
        );
    };

    // Filter menu items based on user role
    const filteredMenuItems = adminMenuItems.filter((item) => {
        if (!item.allowedRoles || item.allowedRoles.length === 0) {
            return true;
        }
        return user && item.allowedRoles.includes(user.role);
    });

    const renderMenuItem = (item: AdminMenuInterface) => {
        const hasChildren = item.children && item.children.length > 0;
        const isChildActive =
            hasChildren && item.children?.some((child) => pathname === `/${child.slug}`);
        const isActive = pathname === `/${item.slug}` || isChildActive;
        const isExpanded = openMenus.includes(item.id);

        if (hasChildren) {
            return (
                <div key={item.id} className="space-y-1">
                    <Button
                        onClick={() => toggleMenu(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                            isActive
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`p-1.5 rounded-md transition-colors ${isActive ? 'bg-primary/15' : 'bg-muted group-hover:bg-accent'}`}
                            >
                                {item.icon}
                            </div>
                            <span>{item.name}</span>
                        </div>
                        <ChevronRight
                            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`}
                        />
                    </Button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="ml-5 mt-1 border-l-2 border-border pl-4 space-y-1">
                            {item.children?.map((child) => {
                                const isChildActive = pathname === `/${child.slug}`;
                                return (
                                    <Link
                                        key={child.id}
                                        href={`/${child.slug}`}
                                        onClick={onClose}
                                        className={`group relative flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                            isChildActive
                                                ? 'text-primary font-medium bg-primary/5'
                                                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                                        }`}
                                    >
                                        {/* Connector Dot */}
                                        <span
                                            className={`absolute -left-[1.35rem] w-2 h-2 rounded-full border-2 border-white transition-all duration-300 ${
                                                isChildActive
                                                    ? 'bg-primary scale-110'
                                                    : 'bg-slate-200 group-hover:bg-slate-400'
                                            }`}
                                        />

                                        <div className="flex items-center gap-3">
                                            {child.icon && (
                                                <span
                                                    className={`transition-colors duration-200 ${
                                                        isChildActive
                                                            ? 'text-primary'
                                                            : 'text-gray-400 group-hover:text-primary'
                                                    }`}
                                                >
                                                    {React.cloneElement(
                                                        child.icon as React.ReactElement<{
                                                            className?: string;
                                                        }>,
                                                        { className: 'w-4 h-4' },
                                                    )}
                                                </span>
                                            )}
                                            <span>{child.name}</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Link
                key={item.id}
                href={`/${item.slug}`}
                onClick={onClose}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                    isActive
                        ? 'bg-primary/10 text-primary font-semibold'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
            >
                <div className="flex items-center gap-3">
                    <div
                        className={`p-1 rounded-md transition-colors ${isActive ? 'bg-primary/15' : 'bg-muted group-hover:bg-accent'}`}
                    >
                        {item.icon}
                    </div>
                    <span>{item.name}</span>
                </div>
                {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white shadow-sm">
                        {item.badge}
                    </span>
                )}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <Button
                    type="button"
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                    aria-label="Close menu"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border">
                    <Link href="/admin" className="flex items-center gap-2">
                        <Globe className="w-8 h-8 text-primary" />
                        <div className="flex flex-col">
                            <span className="font-bold text-xl text-foreground">Web Profile</span>
                            <span className="text-xs text-primary font-semibold">
                                Admin Panel
                            </span>
                        </div>
                    </Link>
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-accent rounded-lg"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </Button>
                </div>

                {/* Sidebar Content */}
                <div className="overflow-y-auto h-[calc(100vh-4rem)] p-4">
                    {/* Menu Items */}
                    <nav className="space-y-1">{filteredMenuItems.map(renderMenuItem)}</nav>
                </div>
            </aside>
        </>
    );
}
