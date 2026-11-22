'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { districtOf, districts, projects, type DistrictId, type Project } from '@/data/projects';
import ProjectLogo from './ProjectLogo';
import RepoList from './RepoList';
import ShotCarousel from './ShotCarousel';

const PAGE_SIZE = 6;

function meta(p: Project) {
    return [districtOf(p.district).name, p.org, p.commits > 0 ? `${p.commits} commits` : null].filter(Boolean).join(' · ');
}

/** Detail popup that springs in over the page. */
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
    const d = districtOf(project.district);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        window.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
        >
            <motion.div
                className="brut relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto bg-white font-mono-brut text-ink"
                initial={{ scale: 0.7, rotate: -3, y: 40 }}
                animate={{ scale: 1, rotate: 0, y: 0 }}
                exit={{ scale: 0.8, rotate: 2, y: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 z-10 flex items-center justify-between border-b-[3px] border-ink px-4 py-2" style={{ background: d.color }}>
                    <span className="text-xs font-bold uppercase">{d.name}</span>
                    <button type="button" onClick={onClose} aria-label="Close" className="brut-sm brut-press bg-white p-1">
                        <X className="h-4 w-4" />
                    </button>
                </div>
                <div className="flex flex-col gap-5 p-5 sm:p-6">
                    <ShotCarousel project={project} />
                    <div className="flex items-center gap-3">
                        <ProjectLogo project={project} className="h-14 w-14" />
                        <div>
                            <h3 className="font-display text-2xl leading-tight uppercase">{project.title}</h3>
                            <p className="text-xs font-bold uppercase text-ink/70">
                                {meta(project)} · {project.year}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm leading-relaxed">{project.summary}</p>
                    <div className="brut-sm bg-paper p-4">
                        <h4 className="mb-2 text-xs font-bold uppercase">Highlights</h4>
                        <ul className="space-y-1.5 text-sm">
                            {project.highlights.map((h) => (
                                <li key={h}>▸ {h}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {project.stack.map((s) => (
                            <span key={s} className="border-2 border-ink bg-lime px-2 py-0.5 text-xs font-bold">
                                {s}
                            </span>
                        ))}
                    </div>
                    {project.repos.length > 0 && (
                        <div>
                            <h4 className="mb-2 text-xs font-bold uppercase">Repositories</h4>
                            <RepoList project={project} />
                        </div>
                    )}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="brut brut-press w-fit bg-grape px-4 py-2 text-sm font-bold uppercase text-white"
                        >
                            Visit live site <ArrowUpRight className="ml-1 inline h-4 w-4" />
                        </a>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

/** Filterable, paginated grid of every project, with a detail popup. */
export default function ProjectsExplorer() {
    const [filter, setFilter] = useState<DistrictId | 'all'>('all');
    const [page, setPage] = useState(0);
    const [open, setOpen] = useState<Project | null>(null);
    const top = useRef<HTMLDivElement>(null);

    const list = (filter === 'all' ? projects : projects.filter((p) => p.district === filter))
        .slice()
        .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.commits - a.commits);
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const current = Math.min(page, pages - 1);
    const visible = list.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);

    const goTo = (n: number) => {
        setPage(n);
        top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    const pick = (f: DistrictId | 'all') => {
        setFilter(f);
        setPage(0);
    };

    return (
        <div ref={top} className="flex scroll-mt-4 flex-col gap-6">
            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => pick('all')}
                    className={cn('brut-sm brut-press px-3 py-1 text-xs font-bold uppercase', filter === 'all' ? 'bg-ink text-white' : 'bg-white')}
                >
                    All · {projects.length}
                </button>
                {districts.map((d) => (
                    <button
                        key={d.id}
                        type="button"
                        onClick={() => pick(d.id)}
                        className="brut-sm brut-press px-3 py-1 text-xs font-bold uppercase"
                        style={{ background: filter === d.id ? d.color : '#fff' }}
                    >
                        {d.name}
                    </button>
                ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                <AnimatePresence mode="popLayout">
                    {visible.map((p, i) => {
                        const d = districtOf(p.district);
                        return (
                            <motion.article
                                key={`${filter}-${current}-${p.slug}`}
                                initial={{ opacity: 0, y: 40, scale: 0.9, rotate: i % 2 ? 1.5 : -1.5 }}
                                whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: (i % PAGE_SIZE) * 0.06 }}
                                whileHover={{ y: -4 }}
                                className="brut flex flex-col bg-white"
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpen(p)}
                                    className="block border-b-[3px] border-ink p-3 text-left"
                                    style={{ background: d.color }}
                                    aria-label={`Open ${p.title}`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={p.shots?.[0]?.src}
                                        alt={`${p.title} preview`}
                                        loading="lazy"
                                        className="brut-sm aspect-[16/10] w-full bg-paper object-cover object-top"
                                    />
                                </button>
                                <div className="flex flex-1 flex-col gap-3 p-4">
                                    <div className="flex items-start gap-3">
                                        <ProjectLogo project={p} />
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-display text-sm leading-tight uppercase">
                                                    {p.featured && <span className="text-grape">★ </span>}
                                                    {p.title}
                                                </h3>
                                                <span className="shrink-0 border-2 border-ink bg-lime px-1.5 text-[11px] font-bold">{p.year}</span>
                                            </div>
                                            <p className="mt-0.5 text-[10px] font-bold uppercase text-ink/70">{meta(p)}</p>
                                        </div>
                                    </div>
                                    <p className="line-clamp-3 text-[13px]">{p.summary}</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {p.stack.slice(0, 4).map((s) => (
                                            <span key={s} className="border-2 border-ink px-1.5 py-0.5 text-[10px] font-bold">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-auto flex flex-wrap gap-2 pt-1">
                                        <button
                                            type="button"
                                            onClick={() => setOpen(p)}
                                            className="brut-sm brut-press bg-white px-3 py-1.5 text-xs font-bold uppercase"
                                        >
                                            View details <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
                                        </button>
                                        {p.liveUrl && (
                                            <a
                                                href={p.liveUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="brut-sm brut-press bg-lime px-3 py-1.5 text-xs font-bold uppercase"
                                            >
                                                Live <ArrowUpRight className="ml-0.5 inline h-3.5 w-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </AnimatePresence>
            </div>

            {pages > 1 && (
                <nav className="flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
                    <button
                        type="button"
                        disabled={current === 0}
                        onClick={() => goTo(current - 1)}
                        aria-label="Previous page"
                        className="brut-sm brut-press bg-punch p-2 disabled:opacity-40"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    {Array.from({ length: pages }, (_, n) => (
                        <button
                            key={n}
                            type="button"
                            onClick={() => goTo(n)}
                            aria-current={n === current ? 'page' : undefined}
                            className={cn('brut-sm brut-press h-9 w-9 text-sm font-bold', n === current ? 'bg-ink text-white' : 'bg-white')}
                        >
                            {n + 1}
                        </button>
                    ))}
                    <button
                        type="button"
                        disabled={current === pages - 1}
                        onClick={() => goTo(current + 1)}
                        aria-label="Next page"
                        className="brut-sm brut-press bg-punch p-2 disabled:opacity-40"
                    >
                        <ArrowRight className="h-4 w-4" />
                    </button>
                    <span className="ml-2 text-xs font-bold uppercase">
                        Page {current + 1} / {pages}
                    </span>
                </nav>
            )}

            <AnimatePresence>{open && <ProjectModal project={open} onClose={() => setOpen(null)} />}</AnimatePresence>
        </div>
    );
}
