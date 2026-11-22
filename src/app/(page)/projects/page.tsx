import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowRight, ArrowUpRight, Gamepad2, Github, Mail, MapPin } from 'lucide-react';
import FeaturedShowcase from '@/components/project/FeaturedShowcase';
import ProjectsExplorer from '@/components/project/ProjectsExplorer';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';

export const metadata: Metadata = {
    title: `Projects · ${profile.name}`,
    description: `${profile.name}, ${profile.role} in ${profile.location}: logistics, health tech, AI, automation, Web3 and enterprise platforms.`,
};

const orgs = Array.from(new Set(projects.map((p) => p.org).filter(Boolean))) as string[];
const email = profile.contact.find((c) => c.label === 'Email')?.href ?? profile.githubUrl;

/** Two-letter tile for each skill, standing in for brand icons. */
function abbr(s: string) {
    const known: Record<string, string> = { TypeScript: 'TS', 'Next.js': 'NX', 'React Native': 'RN', PostgreSQL: 'PG', RabbitMQ: 'MQ', ArcGIS: 'GIS', NestJS: 'NE' };
    return known[s] ?? s.slice(0, 2).toUpperCase();
}

const SKILL_COLORS = ['bg-lime', 'bg-punch', 'bg-aqua', 'bg-white', 'bg-grape text-white'];

export default function ProjectsPage() {
    return (
        <div className="min-h-screen bg-paper p-2 font-mono-brut text-ink sm:p-6">
            <div className="brut mx-auto max-w-6xl overflow-hidden bg-white">
                {/* Nav */}
                <nav className="flex items-stretch border-b-[3px] border-ink text-xs font-bold uppercase">
                    <Link href="/projects" className="flex items-center gap-1 border-r-[3px] border-ink bg-lime px-4 py-3">
                        {'</>'} {profile.name.split(' ')[0]}
                    </Link>
                    <div className="hidden flex-1 items-center justify-center gap-6 md:flex">
                        <a href="#skills" className="hover:underline">Skills</a>
                        <a href="#featured" className="hover:underline">Projects</a>
                        <a href="#experience" className="hover:underline">Experience</a>
                        <a href="#work" className="hover:underline">All work</a>
                    </div>
                    <div className="flex-1 md:hidden" />
                    <Link href="/" className="flex items-center gap-1.5 border-l-[3px] border-ink bg-grape px-4 py-3 text-white">
                        <Gamepad2 className="h-4 w-4" /> Play the island
                    </Link>
                </nav>

                {/* Hero */}
                <section className="grid border-b-[3px] border-ink md:grid-cols-2">
                    <div className="bg-grid-paper flex flex-col gap-5 border-ink p-6 sm:p-10 md:border-r-[3px]">
                        <span className="w-fit bg-grape px-2 py-1 text-xs font-bold uppercase text-white">Hey, I&apos;m {profile.name.split(' ')[0]} 👋</span>
                        <h1 className="font-display text-4xl leading-[0.95] uppercase sm:text-6xl">
                            Full stack
                            <br />
                            developer
                        </h1>
                        <p className="max-w-md text-sm leading-relaxed">{profile.summary}</p>
                        <p className="flex items-center gap-1 text-xs font-bold uppercase">
                            <MapPin className="h-4 w-4" /> {profile.location}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a href="#featured" className="brut brut-press bg-lime px-4 py-2.5 text-sm font-bold uppercase">
                                View my work <ArrowUpRight className="ml-1 inline h-4 w-4" />
                            </a>
                            <Link href="/" className="brut brut-press bg-white px-4 py-2.5 text-sm font-bold uppercase">
                                Play the island <Gamepad2 className="ml-1 inline h-4 w-4" />
                            </Link>
                        </div>
                        <div>
                            <p className="mb-2 text-xs font-bold uppercase">Connect with me</p>
                            <div className="flex gap-3">
                                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="brut-sm brut-press bg-white p-2">
                                    <Github className="h-5 w-5" />
                                </a>
                                <a href={email} aria-label="Email" className="brut-sm brut-press bg-white p-2">
                                    <Mail className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-punch p-8">
                        <div className="relative">
                            <div className="absolute -top-4 -right-4 h-full w-full border-[3px] border-ink bg-lime" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="relative h-64 w-56 border-[3px] border-ink object-cover sm:h-80 sm:w-64"
                            />
                            <pre className="brut absolute -right-6 -bottom-10 bg-grape p-3 text-[11px] leading-relaxed text-white sm:-right-16 sm:text-xs">
                                <span className="text-lime">&gt; const</span> developer = {'{'}
                                {'\n'}  stack: <span className="text-lime">&apos;Go · NestJS · Next.js&apos;</span>,
                                {'\n'}  at: <span className="text-lime">&apos;Faztrack Consulting&apos;</span>,
                                {'\n'}  builds: <span className="text-lime">&apos;depots, bots, IoT&apos;</span>,
                                {'\n'}{'}'}
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Skills */}
                <section id="skills" className="grid border-b-[3px] border-ink sm:grid-cols-[180px_1fr]">
                    <div className="flex items-center justify-between gap-2 border-ink bg-grape p-5 text-white sm:flex-col sm:items-start sm:justify-center sm:border-r-[3px]">
                        <span className="font-display text-2xl uppercase">Skills</span>
                        <ArrowRight className="h-5 w-5" />
                    </div>
                    <div className="flex gap-4 overflow-x-auto bg-paper p-5">
                        {profile.stack.map((s, i) => (
                            <div key={s} className="flex w-20 shrink-0 flex-col items-center gap-2 text-center">
                                <span className={`brut-sm flex h-12 w-12 items-center justify-center font-display text-sm ${SKILL_COLORS[i % SKILL_COLORS.length]}`}>
                                    {abbr(s)}
                                </span>
                                <span className="text-[11px] font-bold">{s}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured + side column */}
                <section id="featured" className="grid border-b-[3px] border-ink lg:grid-cols-[2fr_1fr]">
                    <div className="border-ink p-5 sm:p-8 lg:border-r-[3px]">
                        <FeaturedShowcase />
                    </div>
                    <aside className="flex flex-col gap-4 bg-lime p-5 sm:p-8">
                        <h2 className="font-display text-2xl uppercase">At a glance</h2>
                        {profile.stats.map((s) => (
                            <div key={s.label} className="brut bg-white p-4">
                                <div className="font-display text-4xl">{s.value}</div>
                                <div className="text-xs font-bold uppercase">{s.label}</div>
                            </div>
                        ))}
                        <div className="brut bg-white p-4">
                            <div className="mb-2 text-xs font-bold uppercase">Built with</div>
                            <ul className="space-y-1 text-sm">
                                {orgs.map((o) => (
                                    <li key={o}>▸ {o}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="brut bg-ink p-4 text-white">
                            <div className="text-xs font-bold uppercase text-lime">Education</div>
                            <div className="mt-1 font-display text-lg uppercase leading-tight">{profile.education.school}</div>
                            <div className="text-xs">
                                {profile.education.degree} · GPA {profile.education.gpa}
                            </div>
                        </div>
                    </aside>
                </section>

                {/* Experience + CTA */}
                <section id="experience" className="grid border-b-[3px] border-ink lg:grid-cols-[200px_1fr_320px]">
                    <div className="flex items-center justify-between gap-2 border-ink bg-punch p-5 lg:flex-col lg:items-start lg:justify-center lg:border-r-[3px]">
                        <span className="font-display text-2xl uppercase">Experience</span>
                        <ArrowRight className="h-5 w-5" />
                    </div>
                    <ol className="relative flex flex-col gap-7 border-ink p-6 sm:p-8 lg:border-r-[3px]">
                        <span aria-hidden className="absolute top-10 bottom-10 left-[33px] w-[3px] bg-ink sm:left-[41px]" />
                        {profile.experience.map((e) => (
                            <li key={e.company + e.period} className="relative pl-8">
                                <span
                                    aria-hidden
                                    className={`absolute top-1 left-0 h-4 w-4 rounded-full border-[3px] border-ink ${e.current ? 'bg-lime' : 'bg-white'}`}
                                />
                                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                                    <h3 className="font-display text-sm uppercase sm:text-base">
                                        {e.role} <span className="text-grape">•</span> {e.company}
                                    </h3>
                                    <span className="text-[11px] font-bold uppercase">{e.period}</span>
                                </div>
                                {e.group && <p className="text-xs font-bold text-grape">{e.group}</p>}
                                {e.logo && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={e.logo} alt={`${e.company} logo`} className={`brut-sm mt-2 h-10 w-auto object-contain p-1.5 ${e.logoDark ? "bg-[#132a46]" : "bg-white"}`} />
                                )}
                                <ul className="mt-1.5 space-y-1 text-[13px] leading-relaxed">
                                    {e.points.map((pt) => (
                                        <li key={pt}>— {pt}</li>
                                    ))}
                                </ul>
                            </li>
                        ))}
                        <li className="relative pl-8">
                            <span aria-hidden className="absolute top-1 left-0 h-4 w-4 rounded-full border-[3px] border-ink bg-punch" />
                            <h3 className="font-display text-sm uppercase">Leadership</h3>
                            <ul className="mt-1.5 space-y-1 text-[13px]">
                                {profile.involvement.map((v) => (
                                    <li key={v.org}>
                                        — {v.role}, {v.org} <span className="text-ink/60">({v.period})</span>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ol>
                    <div className="bg-grid-grape relative flex flex-col justify-center gap-5 overflow-hidden p-6 text-white sm:p-8">
                        <h2 className="font-display text-3xl leading-tight uppercase">Let&apos;s build something amazing together.</h2>
                        <a href={email} className="brut brut-press w-fit bg-white px-4 py-2.5 text-sm font-bold uppercase text-ink">
                            Get in touch <ArrowRight className="ml-1 inline h-4 w-4" />
                        </a>
                        <svg aria-hidden viewBox="0 0 100 100" className="absolute -right-6 -bottom-6 h-32 w-32">
                            <polygon
                                points="50,0 61,25 88,12 76,39 100,50 76,61 88,88 61,75 50,100 39,75 12,88 24,61 0,50 24,39 12,12 39,25"
                                fill="var(--color-punch)"
                                stroke="var(--color-ink)"
                                strokeWidth="3"
                            />
                        </svg>
                    </div>
                </section>

                {/* All work */}
                <section id="work" className="bg-grid-paper border-b-[3px] border-ink p-5 sm:p-8">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="font-display text-3xl uppercase">All work</h2>
                            <p className="text-sm">Sorted by how much I built. Private repositories are listed without a link.</p>
                        </div>
                        <a href="#featured" className="brut-sm brut-press bg-white px-3 py-1.5 text-xs font-bold uppercase">
                            Back to top <ArrowDown className="ml-1 inline h-3.5 w-3.5 rotate-180" />
                        </a>
                    </div>
                    <ProjectsExplorer />
                </section>

                {/* Footer */}
                <footer className="flex items-stretch text-xs font-bold uppercase">
                    <span className="flex items-center border-r-[3px] border-ink bg-lime px-4 py-3">{'</>'} {profile.name.split(' ')[0]}</span>
                    <span className="flex flex-1 items-center justify-center px-3 text-center normal-case">
                        © {new Date().getFullYear()} {profile.name}. All rights reserved.
                    </span>
                    <span className="flex items-center gap-2 border-l-[3px] border-ink px-4">
                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                            <Github className="h-4 w-4" />
                        </a>
                        <a href={email} aria-label="Email">
                            <Mail className="h-4 w-4" />
                        </a>
                    </span>
                </footer>
            </div>
        </div>
    );
}
