'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import useAdminNavbar from './hook/admin.navbar.hook';
import { Menu, Eye, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import ThemeToggle from '../custom/theme-toggle';

interface AdminNavbarProps {
    onMenuClick: () => void;
}

export default function AdminNavbar({ onMenuClick }: Readonly<AdminNavbarProps>) {
    const { user, logout } = useAdminNavbar();
    const [profileOpen, setProfileOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Clicking outside or pressing Escape dismisses the open panel.
    useEffect(() => {
        if (!profileOpen) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) setProfileOpen(false);
        };
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setProfileOpen(false);
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [profileOpen]);

    return (
        <header className="sticky top-0 z-30 bg-card border-b border-border">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 hover:bg-accent rounded-lg transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu className="w-5 h-5 text-foreground" />
                    </button>

                    <div className="hidden md:block">
                        <h1 className="text-lg font-semibold text-foreground">Admin Dashboard</h1>
                        <p className="text-sm text-muted-foreground">
                            Welcome back{user?.name ? `, ${user.name}` : ''}
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div ref={menuRef} className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-accent rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        <span>View Site</span>
                    </Link>

                    <ThemeToggle />

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setProfileOpen((open) => !open)}
                            aria-expanded={profileOpen}
                            aria-label="Account menu"
                            className="flex items-center gap-2 p-1.5 hover:bg-accent rounded-lg transition-colors"
                        >
                            <Avatar size="sm" className="ring-1 ring-border">
                                <AvatarImage src={user?.avatar || ''} alt={user?.name || 'Admin user'} />
                                <AvatarFallback variant="primary">
                                    {user?.name?.charAt(0).toUpperCase() || 'A'}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-64 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border z-40">
                                <div className="p-3 border-b border-border">
                                    <p className="font-medium">{user?.name || 'Admin User'}</p>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-2 flex flex-col gap-2">
                                    <Button
                                        onClick={() => logout()}
                                        variant={'outlineDanger'}
                                        width={'full'}
                                        className="flex items-center justify-start gap-2 font-normal"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
