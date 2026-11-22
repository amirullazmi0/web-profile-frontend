// Identity, experience and contact shown at HQ and on /projects. Source: CV.

export const GITHUB_USER = 'amirullazmi0';

export interface Experience {
    role: string;
    company: string;
    group?: string;
    period: string;
    current?: boolean;
    logo?: string;
    /** Logo is light-on-dark and needs a dark tile. */
    logoDark?: boolean;
    points: string[];
}

export const profile = {
    name: 'Amirull Azmi',
    role: 'Full Stack Developer',
    tagline: 'IT Consultant at Faztrack Consulting',
    location: 'South Jakarta, Indonesia',
    summary:
        'Full Stack Developer with 4+ years building enterprise applications and IoT solutions: Go and NestJS backends, Next.js frontends, and systems for ERP, CRM, logistics and GIS workflows.',
    githubUrl: `https://github.com/${GITHUB_USER}`,
    activeSince: 2021,
    avatar: '/avatar.jpg',
    stats: [
        { label: 'Years experience', value: '4+' },
        { label: 'Repositories', value: '73' },
        { label: 'Contributions (2026)', value: '1.5K+' },
    ],
    stack: [
        'Go',
        'TypeScript',
        'NestJS',
        'Gin',
        'Next.js',
        'React Native',
        'Python',
        'Laravel',
        'PostgreSQL',
        'RabbitMQ',
        'IoT',
        'ArcGIS',
    ],
    experience: [
        {
            role: 'IT Consultant',
            company: 'Faztrack Consulting',
            logo: '/logos/faztrack.webp',
            logoDark: true,
            period: '2026 – Present',
            current: true,
            points: [
                'Technology and AI side of Faztrack’s People, Process, Technology & AI consulting',
                'Helping companies close the gap between business standards and execution in the field',
            ],
        },
        {
            role: 'Application Engineer Specialist',
            company: 'PT Praweda Sarana Informatika',
            group: 'Samudera Indonesia Group',
            logo: '/logos/samudera.webp',
            period: 'Aug 2025 – Nov 2026',
            points: [
                'Built IDS (Integrated Depot System) for container, vessel and depot operations',
                'Backend services in NestJS and Go for logistics and maritime operations',
                'IoT integrated into physical depot infrastructure for real-time monitoring',
                'Reporting modules with JasperReports for management analytics',
            ],
        },
        {
            role: 'Full Stack Developer',
            company: 'PT Amani Group Indonesia',
            period: 'Jun 2024 – Aug 2025',
            points: [
                'Built and scaled an ecosystem of 8+ apps: CRM, ERP and supplier management',
                'Architected the Amani Admin Platform for eight stakeholder groups',
                'RabbitMQ messaging and Server-Sent Events for real-time updates',
                'Atomic Design frontend; modernized legacy CRM modules',
            ],
        },
        {
            role: 'Programmer',
            company: 'RSUD dr. Abdul Aziz',
            group: 'Singkawang City',
            logo: '/logos/rsudaa.webp',
            period: 'Oct 2023 – Jun 2024',
            points: [
                'Internal apps for employee management and public information',
                'Hospital network and servers at 99% uptime for critical systems',
            ],
        },
        {
            role: 'Full Stack & IoT Developer',
            company: 'Freelance',
            period: 'Jul 2021 – Present',
            current: true,
            points: [
                'WebGIS for sanitation distribution in Bengkayang and the E-DPO system for the West Kalimantan High Prosecutor’s Office',
                'Water quality and flood detection IoT systems for Putussibau with real-time dashboards',
                'Lab equipment loan system for Universitas Tanjungpura; company sites for PT Maricar and House of Negative',
                'NFT generation tools, Web3 trading bots and social media automation',
            ],
        },
    ] satisfies Experience[],
    education: {
        school: 'Universitas Tanjungpura',
        degree: 'Bachelor of Informatics Engineering',
        gpa: '3.75',
    },
    involvement: [
        { role: 'Leader', org: 'Student Association of Informatics, Universitas Tanjungpura', period: 'Jan 2022 – Feb 2023' },
        {
            role: 'Programmer',
            org: 'Robotics Team, Universitas Tanjungpura · Indonesian Robot Contest finalist 2019 & 2020',
            period: 'Jun 2019 – Mar 2022',
        },
    ],
    contact: [
        { label: 'GitHub', href: `https://github.com/${GITHUB_USER}` },
        { label: 'Email', href: 'mailto:amirullazmi0@gmail.com' },
    ],
};
