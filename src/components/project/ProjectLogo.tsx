import { cn } from '@/lib/utils';
import { districtOf, type Project } from '@/data/projects';

/** Project logo, or a lettermark in the district color when the repo has none. */
export default function ProjectLogo({ project, className }: { project: Project; className?: string }) {
    const color = districtOf(project.district).color;
    if (project.logo) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={project.logo}
                alt={`${project.title} logo`}
                className={cn('brut-sm h-10 w-10 shrink-0 bg-white object-contain p-1', className)}
            />
        );
    }
    const letters = project.title
        .replace(/[^A-Za-z0-9 ]/g, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();
    return (
        <div
            aria-hidden
            className={cn(
                'brut-sm flex h-10 w-10 shrink-0 items-center justify-center font-display text-sm text-ink',
                className,
            )}
            style={{ background: color }}
        >
            {letters}
        </div>
    );
}
