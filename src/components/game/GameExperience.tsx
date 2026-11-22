'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { AnimatePresence, motion } from 'framer-motion';
import { useProgress } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { useGameStore } from '@/stores/game.store';
import Hud from './ui/Hud';
import ProjectPanel from './ui/ProjectPanel';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

let webglCache: boolean | undefined;
function hasWebGL() {
    if (webglCache !== undefined) return webglCache;
    try {
        const canvas = document.createElement('canvas');
        webglCache = Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
    } catch {
        webglCache = false;
    }
    return webglCache;
}

const noopSubscribe = () => () => {};

/** null on the server, the browser value after hydration. */
function useClientValue<T>(read: () => T): T | null {
    return useSyncExternalStore<T | null>(noopSubscribe, read, () => null);
}

const readReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function IntroOverlay({ webgl }: { webgl: boolean }) {
    const started = useGameStore((s) => s.started);
    const start = useGameStore((s) => s.start);
    const { active, progress } = useProgress();
    const reducedMotion = useClientValue(readReducedMotion);

    const ready = webgl && !active;

    return (
        <AnimatePresence>
            {!started && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 p-4 text-white backdrop-blur-sm"
                >
                    <div className="w-full max-w-md text-center">
                        <p className="text-sm tracking-widest text-cyan-300 uppercase">Portfolio Island</p>
                        <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
                        <p className="mt-2 text-slate-300">
                            {profile.role} · {profile.location}
                        </p>
                        <p className="mt-6 text-sm text-slate-400">
                            Drive around an island of {projects.length} projects. Park next to a building to open it, or
                            use the map to jump between districts.
                        </p>

                        {webgl ? (
                            <div className="mt-8 flex flex-col items-center gap-3">
                                <Button
                                    size="lg"
                                    onClick={start}
                                    disabled={!ready}
                                    className="min-w-48 bg-cyan-400 font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 hover:bg-cyan-300"
                                >
                                    {ready ? 'Start driving' : `Loading ${Math.round(progress)}%`}
                                </Button>
                                <Link href="/projects" className="text-sm text-slate-300 underline-offset-4 hover:underline">
                                    {reducedMotion ? 'Prefer less motion? Open classic mode' : 'Skip to classic mode'}
                                </Link>
                            </div>
                        ) : (
                            <div className="mt-8 flex flex-col items-center gap-3">
                                <p className="text-sm text-amber-300">This browser cannot run WebGL.</p>
                                <Link href="/projects">
                                    <Button size="lg">Open classic mode</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function GameExperience() {
    const { resolvedTheme } = useTheme();
    const webgl = useClientValue(hasWebGL);

    const night = resolvedTheme === 'dark';

    return (
        <main className="fixed inset-0 overflow-hidden bg-slate-950">
            {webgl && <Scene night={night} />}
            {webgl && <Hud />}
            {webgl !== null && <IntroOverlay webgl={webgl} />}
            <ProjectPanel />
        </main>
    );
}
