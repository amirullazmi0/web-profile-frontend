'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Project } from '@/data/projects';

/** Screenshots of a project in a bold frame, with arrows, dots and swipe. */
export default function ShotCarousel({ project, className }: { project: Project; className?: string }) {
    const shots = project.shots ?? [];
    const [index, setIndex] = useState(0);
    const [dir, setDir] = useState(1);
    if (shots.length === 0) return null;

    const go = (step: number) => {
        setDir(step);
        setIndex((i) => (i + step + shots.length) % shots.length);
    };
    const shot = shots[index];

    return (
        <div className={cn('flex flex-col gap-2 font-mono-brut', className)}>
            <div className="brut overflow-hidden bg-white">
                <div className="flex items-center gap-2 border-b-[3px] border-ink bg-lime px-3 py-1.5">
                    <span className="h-3 w-3 rounded-full border-2 border-ink bg-punch" />
                    <span className="h-3 w-3 rounded-full border-2 border-ink bg-white" />
                    <span className="h-3 w-3 rounded-full border-2 border-ink bg-aqua" />
                    <span className="ml-1 truncate text-[11px] font-bold text-ink">
                        {project.liveUrl ? project.liveUrl.replace(/^https?:\/\//, '') : project.title}
                    </span>
                </div>
                <div className="relative aspect-[16/10] overflow-hidden bg-paper">
                    <AnimatePresence initial={false} custom={dir} mode="popLayout">
                        <motion.img
                            key={shot.src}
                            src={shot.src}
                            alt={`${project.title}: ${shot.caption}`}
                            custom={dir}
                            initial={{ x: `${dir * 100}%` }}
                            animate={{ x: 0 }}
                            exit={{ x: `${-dir * 100}%` }}
                            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                            drag={shots.length > 1 ? 'x' : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -60) go(1);
                                else if (info.offset.x > 60) go(-1);
                            }}
                            className="absolute inset-0 h-full w-full cursor-grab object-cover object-top active:cursor-grabbing"
                            draggable={false}
                            loading="lazy"
                        />
                    </AnimatePresence>
                </div>
            </div>
            <div className="flex items-center justify-between gap-2 pt-1">
                <span className="truncate text-xs text-ink/70">{shot.caption}</span>
                {shots.length > 1 && (
                    <div className="flex shrink-0 items-center gap-2">
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Previous screenshot"
                            className="brut-sm brut-press bg-punch p-1 text-ink"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="flex gap-1">
                            {shots.map((s, i) => (
                                <button
                                    key={s.src}
                                    type="button"
                                    aria-label={`Screenshot ${i + 1}`}
                                    onClick={() => {
                                        setDir(i > index ? 1 : -1);
                                        setIndex(i);
                                    }}
                                    className={cn(
                                        'h-2.5 w-2.5 rounded-full border-2 border-ink',
                                        i === index ? 'bg-ink' : 'bg-white',
                                    )}
                                />
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Next screenshot"
                            className="brut-sm brut-press bg-punch p-1 text-ink"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
