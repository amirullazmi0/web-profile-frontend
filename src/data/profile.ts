// Identity and stats shown at HQ and in classic mode.
// Experience and contact are placeholders: edit them here.

export const GITHUB_USER = 'amirullazmi0';

export const profile = {
    name: 'Amirull Azmi',
    role: 'Full Stack Developer',
    tagline: 'Software Engineer · IT Consultant',
    location: 'Jakarta, Indonesia',
    githubUrl: `https://github.com/${GITHUB_USER}`,
    activeSince: 2021,
    stats: [
        { label: 'Repositories', value: '73' },
        { label: 'Contributions (2026)', value: '1.5K+' },
        { label: 'Years building', value: '5+' },
    ],
    stack: ['Go', 'TypeScript', 'NestJS', 'Next.js', 'React', 'Python', 'Rust', 'PHP', 'PostgreSQL', 'Docker'],
    // PLACEHOLDER: replace with real roles.
    experience: [
        {
            role: 'Full Stack Developer',
            company: 'Your company',
            period: '2024 – now',
            summary: 'Fleet telematics, AI data pipelines and automation platforms.',
        },
        {
            role: 'Software Developer',
            company: 'Your company',
            period: '2022 – 2024',
            summary: 'Web platforms for clients, IoT dashboards and REST APIs.',
        },
    ],
    // PLACEHOLDER: add public contact links.
    contact: [
        { label: 'GitHub', href: `https://github.com/${GITHUB_USER}` },
        { label: 'LinkedIn', href: '#' },
        { label: 'Email', href: '#' },
    ],
} as const;
