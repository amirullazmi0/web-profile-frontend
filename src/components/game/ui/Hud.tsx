'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, LogIn } from 'lucide-react';
import ThemeToggle from '@/components/custom/theme-toggle';
import { Button } from '@/components/ui/button';
import { districtOf, projects } from '@/data/projects';
import { profile } from '@/data/profile';
import { HQ_SLUG, useGameStore } from '@/stores/game.store';
import Minimap from './Minimap';
import TouchControls from './TouchControls';
import { useIsMobile } from './useIsMobile';

function nameOf(slug: string) {
    if (slug === HQ_SLUG) return `${profile.name} HQ`;
    return projects.find((p) => p.slug === slug)?.title ?? slug;
}

export default function Hud() {
    const nearbySlug = useGameStore((s) => s.nearbySlug);
    const selectedSlug = useGameStore((s) => s.selectedSlug);
    const activeDistrict = useGameStore((s) => s.activeDistrict);
    const select = useGameStore((s) => s.select);
    const isMobile = useIsMobile();

    // E / Enter opens the building the rover is parked next to.
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.code !== 'KeyE' && e.code !== 'Enter') return;
            const { nearbySlug: near, selectedSlug: sel } = useGameStore.getState();
            if (near && !sel) select(near);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [select]);

    const district = activeDistrict ? districtOf(activeDistrict) : null;

    return (
        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col justify-between p-4 text-white">
            {/* Top bar */}
            <div className="flex items-start justify-between gap-3">
                <div className="pointer-events-auto rounded-xl bg-slate-900/70 px-4 py-2 shadow-lg backdrop-blur">
                    <div className="text-sm font-bold sm:text-base">{profile.name}</div>
                    <div className="text-[11px] opacity-75 sm:text-xs">{profile.role}</div>
                </div>
                <div className="pointer-events-auto flex items-center gap-1 rounded-xl bg-slate-900/70 p-1 shadow-lg backdrop-blur">
                    <Link href="/projects" aria-label="Classic mode">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
                            <LayoutGrid className="h-4 w-4" />
                            <span className="hidden sm:inline">Classic</span>
                        </Button>
                    </Link>
                    <Link href="/auth/sign-in" aria-label="Sign in">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
                            <LogIn className="h-4 w-4" />
                            <span className="hidden sm:inline">Sign in</span>
                        </Button>
                    </Link>
                    <div className="text-white [&_button:hover]:bg-white/10">
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* District banner */}
            <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2">
                <AnimatePresence mode="wait">
                    {district && (
                        <motion.div
                            key={district.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="rounded-full px-4 py-1.5 text-center text-sm font-semibold shadow-lg"
                            style={{ background: district.color }}
                        >
                            {district.name}
                            <div className="text-[11px] font-normal opacity-90">{district.blurb}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bottom */}
            <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col items-start gap-3">
                    {isMobile ? (
                        <TouchControls />
                    ) : (
                        <div className="rounded-lg bg-slate-900/60 px-3 py-2 text-[11px] leading-5 opacity-80 backdrop-blur">
                            <b>WASD / ←↑↓→</b> drive · <b>Space</b> brake · <b>E</b> open · <b>R</b> reset
                        </div>
                    )}
                </div>

                <AnimatePresence>
                    {nearbySlug && !selectedSlug && (
                        <motion.button
                            type="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            onClick={() => select(nearbySlug)}
                            className="pointer-events-auto absolute bottom-6 left-1/2 max-w-[70vw] -translate-x-1/2 truncate rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-xl"
                        >
                            {isMobile ? 'Tap' : 'Press E'} to open · {nameOf(nearbySlug)}
                        </motion.button>
                    )}
                </AnimatePresence>

                <div className="pointer-events-auto">
                    <Minimap />
                </div>
            </div>
        </div>
    );
}
