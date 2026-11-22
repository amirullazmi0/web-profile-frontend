'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { districtOf, projects } from '@/data/projects';
import ProjectLogo from './ProjectLogo';
import ShotCarousel from './ShotCarousel';

const showcase = projects
    .filter((p) => p.featured && p.shots && p.shots.length > 0)
    .sort((a, b) => Number(Boolean(b.liveUrl)) - Number(Boolean(a.liveUrl)) || b.commits - a.commits);

/** Featured projects, one at a time, in the bold card style. */
export default function FeaturedShowcase() {
    const [active, setActive] = useState(0);
    const project = showcase[active];
    const district = districtOf(project.district);
    const go = (step: number) => setActive((i) => (i + step + showcase.length) % showcase.length);

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-2xl uppercase sm:text-3xl">Featured projects</h2>
                <div className="flex gap-2">
                    <button type="button" onClick={() => go(-1)} aria-label="Previous project" className="brut-sm brut-press bg-punch p-2">
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => go(1)} aria-label="Next project" className="brut-sm brut-press bg-punch p-2">
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
            <a href="#work" className="brut-sm brut-press w-fit bg-white px-3 py-1.5 text-xs font-bold uppercase">
                View all projects <ArrowDown className="ml-1 inline h-3.5 w-3.5" />
            </a>

            <AnimatePresence mode="wait">
                <motion.div
                    key={project.slug}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.2 }}
                    className="brut flex flex-col bg-white"
                >
                    <div className="border-b-[3px] border-ink p-4" style={{ background: district.color }}>
                        <ShotCarousel project={project} />
                    </div>
                    <div className="flex flex-col gap-3 p-5">
                        <div className="flex items-center gap-3">
                            <ProjectLogo project={project} className="h-12 w-12" />
                            <div className="min-w-0">
                                <h3 className="font-display text-xl uppercase">{project.title}</h3>
                                <p className="text-xs font-bold uppercase">
                                    {district.name}
                                    {project.org && ` · ${project.org}`}
                                    {project.commits > 0 && ` · ${project.commits} commits`}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm">{project.summary}</p>
                        <div className="flex flex-wrap gap-1.5">
                            {project.stack.map((s) => (
                                <span key={s} className="border-2 border-ink px-2 py-0.5 text-[11px] font-bold">
                                    {s}
                                </span>
                            ))}
                        </div>
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="brut brut-press mt-1 w-fit bg-lime px-4 py-2 text-sm font-bold uppercase"
                            >
                                Visit live site <ArrowUpRight className="ml-1 inline h-4 w-4" />
                            </a>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2">
                {showcase.map((p, i) => (
                    <button
                        key={p.slug}
                        type="button"
                        aria-label={`Show ${p.title}`}
                        onClick={() => setActive(i)}
                        className={cn('h-3 w-3 rounded-full border-2 border-ink', i === active ? 'bg-ink' : 'bg-white')}
                    />
                ))}
            </div>
        </div>
    );
}
