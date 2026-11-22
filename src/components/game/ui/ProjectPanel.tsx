'use client';

import { ExternalLink, Lock, MapPin } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { districtOf, projects, repoUrl, type Project } from '@/data/projects';
import { profile } from '@/data/profile';
import { HQ_SLUG, useGameStore } from '@/stores/game.store';
import { useIsMobile } from './useIsMobile';

export function RepoList({ project }: { project: Project }) {
    return (
        <ul className="flex flex-col gap-1.5">
            {project.repos.map((repo) => {
                const url = repoUrl(repo);
                return (
                    <li key={repo.name}>
                        {url ? (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm hover:bg-accent"
                            >
                                <span className="font-mono">{repo.name}</span>
                                <ExternalLink className="h-4 w-4 opacity-60" />
                            </a>
                        ) : (
                            <div className="flex items-center justify-between rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
                                <span className="font-mono">{repo.name}</span>
                                <span className="flex items-center gap-1 text-xs">
                                    <Lock className="h-3.5 w-3.5" /> Private
                                </span>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}

function ProjectBody({ project }: { project: Project }) {
    const district = districtOf(project.district);
    return (
        <>
            <SheetHeader>
                <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: district.color }}>
                    <span className="inline-block h-2 w-2 rounded-full" style={{ background: district.color }} />
                    {district.name} · {project.year}
                </div>
                <SheetTitle className="text-xl">{project.title}</SheetTitle>
                <SheetDescription>{project.summary}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-5 px-4 pb-6">
                <section>
                    <h3 className="mb-2 text-sm font-semibold">Highlights</h3>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {project.highlights.map((h) => (
                            <li key={h}>{h}</li>
                        ))}
                    </ul>
                </section>
                <section>
                    <h3 className="mb-2 text-sm font-semibold">Stack</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {project.stack.map((s) => (
                            <Badge key={s} variant="secondary">
                                {s}
                            </Badge>
                        ))}
                    </div>
                </section>
                <section>
                    <h3 className="mb-2 text-sm font-semibold">Repositories</h3>
                    <RepoList project={project} />
                </section>
            </div>
        </>
    );
}

function ProfileBody() {
    return (
        <>
            <SheetHeader>
                <div className="text-xs font-semibold text-cyan-500">HQ</div>
                <SheetTitle className="text-2xl">{profile.name}</SheetTitle>
                <SheetDescription>
                    {profile.role} · {profile.tagline}
                </SheetDescription>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </div>
            </SheetHeader>
            <div className="flex flex-col gap-5 px-4 pb-6">
                <div className="grid grid-cols-3 gap-2">
                    {profile.stats.map((s) => (
                        <div key={s.label} className="rounded-lg border p-2 text-center">
                            <div className="text-lg font-bold">{s.value}</div>
                            <div className="text-[11px] text-muted-foreground">{s.label}</div>
                        </div>
                    ))}
                </div>
                <section>
                    <h3 className="mb-2 text-sm font-semibold">Stack</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {profile.stack.map((s) => (
                            <Badge key={s} variant="secondary">
                                {s}
                            </Badge>
                        ))}
                    </div>
                </section>
                <section>
                    <h3 className="mb-2 text-sm font-semibold">Experience</h3>
                    <ol className="space-y-3 border-l pl-4">
                        {profile.experience.map((e) => (
                            <li key={e.period}>
                                <div className="text-sm font-medium">
                                    {e.role} · {e.company}
                                </div>
                                <div className="text-xs text-muted-foreground">{e.period}</div>
                                <p className="text-sm text-muted-foreground">{e.summary}</p>
                            </li>
                        ))}
                    </ol>
                </section>
                <section>
                    <h3 className="mb-2 text-sm font-semibold">Contact</h3>
                    <div className="flex flex-wrap gap-2">
                        {profile.contact.map((c) => (
                            <a
                                key={c.label}
                                href={c.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-md border px-3 py-1.5 text-sm hover:bg-accent"
                            >
                                {c.label}
                            </a>
                        ))}
                    </div>
                </section>
                <p className="text-xs text-muted-foreground">
                    {projects.length} projects across the island. Drive to a building or use the map.
                </p>
            </div>
        </>
    );
}

export default function ProjectPanel() {
    const selectedSlug = useGameStore((s) => s.selectedSlug);
    const select = useGameStore((s) => s.select);
    const isMobile = useIsMobile();
    const project = projects.find((p) => p.slug === selectedSlug);
    const open = selectedSlug === HQ_SLUG || Boolean(project);

    return (
        <Sheet open={open} onOpenChange={(o) => !o && select(null)}>
            <SheetContent
                side={isMobile ? 'bottom' : 'right'}
                className={isMobile ? 'max-h-[80dvh] overflow-y-auto' : 'overflow-y-auto sm:max-w-md'}
            >
                {selectedSlug === HQ_SLUG ? <ProfileBody /> : project ? <ProjectBody project={project} /> : null}
            </SheetContent>
        </Sheet>
    );
}
