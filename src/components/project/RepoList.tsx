import { ArrowUpRight, Lock } from 'lucide-react';
import { repoUrl, type Project } from '@/data/projects';

/** Repos of a project. Private repos render as plain text: never a link to GitHub. */
export default function RepoList({ project }: { project: Project }) {
    if (project.repos.length === 0) return null;
    return (
        <ul className="flex flex-col gap-2 font-mono-brut">
            {project.repos.map((repo) => {
                const url = repoUrl(repo);
                return (
                    <li key={`${repo.owner ?? ''}/${repo.name}`}>
                        {url ? (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="brut-sm brut-press flex items-center justify-between gap-2 bg-white px-3 py-1.5 text-xs font-bold text-ink"
                            >
                                <span className="truncate">{repo.name}</span>
                                <ArrowUpRight className="h-4 w-4 shrink-0" />
                            </a>
                        ) : (
                            <div className="flex items-center justify-between gap-2 border-2 border-dashed border-ink/50 bg-paper px-3 py-1.5 text-xs text-ink/70">
                                <span className="truncate">{repo.name}</span>
                                <span className="flex shrink-0 items-center gap-1 font-bold">
                                    <Lock className="h-3.5 w-3.5" /> PRIVATE
                                </span>
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
}
