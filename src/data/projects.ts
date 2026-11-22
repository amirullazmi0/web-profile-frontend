import { GITHUB_USER } from './profile';

export type DistrictId = 'fleet' | 'ai' | 'bots' | 'web3' | 'iot' | 'web' | 'toolkit';

export interface District {
    id: DistrictId;
    name: string;
    blurb: string;
    color: string;
    /** Center of the district on the island (x, z). */
    position: [number, number];
}

/**
 * A repo is either public (linkable) or private. Private repos keep only
 * their name: no URL is stored and none is ever built for them.
 */
export type Repo = { name: string; private?: false } | { name: string; private: true };

export interface Project {
    slug: string;
    title: string;
    district: DistrictId;
    summary: string;
    highlights: string[];
    stack: string[];
    repos: Repo[];
    year: number;
    featured?: boolean;
}

/** GitHub link for a public repo, or null for a private one. */
export function repoUrl(repo: Repo): string | null {
    if (repo.private) return null;
    return `https://github.com/${GITHUB_USER}/${repo.name}`;
}

export const districts: District[] = [
    {
        id: 'fleet',
        name: 'Fleet & Telematics',
        blurb: 'GPS trackers, fleet and vehicle management.',
        color: '#f59e0b',
        position: [0, -46],
    },
    {
        id: 'ai',
        name: 'AI & Data Intelligence',
        blurb: 'Collectors, computer vision and data products.',
        color: '#8b5cf6',
        position: [40, -24],
    },
    {
        id: 'bots',
        name: 'Automation & Bots',
        blurb: 'Bots and agents that run on their own.',
        color: '#06b6d4',
        position: [42, 22],
    },
    {
        id: 'web3',
        name: 'Web3 Lab',
        blurb: 'Solana, wallets and NFTs.',
        color: '#ec4899',
        position: [4, 46],
    },
    {
        id: 'iot',
        name: 'IoT Flood Lab',
        blurb: 'Flood sensors, WebGIS and the systems around them.',
        color: '#3b82f6',
        position: [-38, 28],
    },
    {
        id: 'web',
        name: 'Web Apps City',
        blurb: 'Client platforms, stores and booking systems.',
        color: '#10b981',
        position: [-42, -18],
    },
    {
        id: 'toolkit',
        name: 'Toolkit Dock',
        blurb: 'Templates and API foundations.',
        color: '#64748b',
        position: [-18, -42],
    },
];

export const projects: Project[] = [
    // Fleet & Telematics
    {
        slug: 'fms',
        title: 'FMS — Fleet Management System',
        district: 'fleet',
        summary:
            'Fleet platform where GPS trackers connect over raw TCP to a Go backend, with separate apps for administrators, supervisors and drivers.',
        highlights: [
            'Single TCP port that detects the device protocol from the first byte',
            'Administrator and supervisor dashboards',
            'Mobile data terminal (MDT) app for drivers',
        ],
        stack: ['Go', 'TCP', 'PostgreSQL', 'Next.js', 'TypeScript'],
        repos: [
            { name: 'fms-backend' },
            { name: 'fms-administrator' },
            { name: 'fms-supervisor' },
            { name: 'fms-mdt' },
        ],
        year: 2026,
        featured: true,
    },
    {
        slug: 'teltonika-test',
        title: 'Teltonika FMC150 Test Bench',
        district: 'fleet',
        summary: 'Tooling to test and decode data from Teltonika FMC150 trackers.',
        highlights: ['Codec parsing and device testing'],
        stack: ['TypeScript', 'TCP'],
        repos: [{ name: 'teltonika_fmc150test', private: true }],
        year: 2026,
    },
    {
        slug: 'vms',
        title: 'VMS — Vehicle Management System',
        district: 'fleet',
        summary: 'Go REST API with JWT auth and a Next.js frontend for managing vehicles.',
        highlights: ['JWT access + refresh, httpOnly cookies', 'Prisma migrations with a Go query builder'],
        stack: ['Go', 'Gin', 'PostgreSQL', 'Next.js'],
        repos: [
            { name: 'vms-backend', private: true },
            { name: 'vms-frontend', private: true },
        ],
        year: 2026,
    },

    // AI & Data Intelligence
    {
        slug: 'alignment-intelligence',
        title: 'Alignment Intelligence',
        district: 'ai',
        summary:
            'Collects regulations from JDIHN, downloads their PDFs and feeds a knowledge library, with a cron dashboard to schedule and watch collectors per ministry.',
        highlights: [
            'Crawler with PostgreSQL checkpoints, no browser automation',
            'Per-ministry cron schedules with a live log stream',
            'Python, NestJS and Next.js services',
        ],
        stack: ['Python', 'NestJS', 'Next.js', 'PostgreSQL'],
        repos: [
            { name: 'alignment-intelligence-collector' },
            { name: 'alignment-intelligence-cron' },
            { name: 'alignment-intelligence-nest', private: true },
            { name: 'alignment-intelligence-next', private: true },
            { name: 'alignment-intelligence-python', private: true },
        ],
        year: 2026,
        featured: true,
    },
    {
        slug: 'leakage-intelligence',
        title: 'Leakage Intelligence',
        district: 'ai',
        summary:
            'Operational hub on WhatsApp: receives messages by webhook, extracts sales and issue reports from text or images, and builds daily recaps.',
        highlights: ['Full message audit log', 'Extraction from text and images', 'Daily sales and issue recaps'],
        stack: ['NestJS', 'TypeScript', 'PostgreSQL', 'WhatsApp'],
        repos: [{ name: 'leakage_intelligence' }],
        year: 2026,
        featured: true,
    },
    {
        slug: 'andalalin',
        title: 'Andalalin Traffic Counter',
        district: 'ai',
        summary:
            'Counts vehicles in traffic survey videos with YOLO and ByteTrack, aggregates intervals and generates an analysis workbook.',
        highlights: ['Resumable chunked video upload', 'Two-direction counting line', 'MC / LV / HV classification'],
        stack: ['Python', 'FastAPI', 'YOLO', 'ByteTrack', 'Next.js'],
        repos: [{ name: 'andalalin-detector-be' }, { name: 'andalalin-detector-frontend', private: true }],
        year: 2026,
    },
    {
        slug: 'fashype',
        title: 'Fashype Engine',
        district: 'ai',
        summary: 'Fashion data engine with a NestJS API and Python processing.',
        highlights: ['NestJS service', 'Python processing engine'],
        stack: ['NestJS', 'Python'],
        repos: [{ name: 'fashype-engine-nest' }, { name: 'fashype-engine-python' }],
        year: 2026,
    },
    {
        slug: 'lead-ai',
        title: 'Lead AI',
        district: 'ai',
        summary: 'AI-assisted lead generation app.',
        highlights: ['Next.js frontend'],
        stack: ['Next.js', 'TypeScript', 'AI'],
        repos: [
            { name: 'lead-ai', private: true },
            { name: 'lead-ai-frontend', private: true },
        ],
        year: 2025,
        featured: true,
    },
    {
        slug: 'fraudguard',
        title: 'FraudGuard Marine (demo)',
        district: 'ai',
        summary: 'Demo of a fraud detection dashboard for the marine sector.',
        highlights: ['Next.js dashboard'],
        stack: ['Next.js', 'TypeScript'],
        repos: [{ name: 'demo-fraudguard-marine' }],
        year: 2026,
    },
    {
        slug: 'auto-clip',
        title: 'Auto Clip',
        district: 'ai',
        summary: 'Automatic video clipping pipeline.',
        highlights: ['Python video processing'],
        stack: ['Python'],
        repos: [{ name: 'auto-clip', private: true }],
        year: 2026,
    },

    // Automation & Bots
    {
        slug: 'masoul-sniper',
        title: 'MaSoul Sniper',
        district: 'bots',
        summary:
            'Solana memecoin trading bot: finds new tokens, filters them through quantitative and safety checks, buys through Jupiter and manages exits on its own.',
        highlights: [
            'Take profit, trailing stop, stop loss and rug exit',
            'Controlled from Telegram, one wallet per chat',
            'Live and dry-run modes side by side',
        ],
        stack: ['TypeScript', 'Solana', 'Jupiter', 'Telegram'],
        repos: [{ name: 'solana-automation' }],
        year: 2026,
        featured: true,
    },
    {
        slug: 'thread-automation',
        title: 'Thread Automation',
        district: 'bots',
        summary:
            'Bot that scans entertainment news, writes engagement captions with OpenAI and posts them to Threads through Playwright.',
        highlights: ['Resolves the original publisher URL', 'Attaches the article image'],
        stack: ['TypeScript', 'OpenAI', 'Playwright'],
        repos: [{ name: 'thread-automation' }],
        year: 2026,
    },
    {
        slug: 'toolbox-whatsapp',
        title: 'Toolbox WhatsApp',
        district: 'bots',
        summary:
            'Read-only WhatsApp toolbox: a collector stores chat history, a REST API serves it, and an MCP server lets an AI assistant read it.',
        highlights: ['OCR, Whisper and PDF extraction for media', 'Allowlisted chats only'],
        stack: ['TypeScript', 'Baileys', 'PostgreSQL', 'MCP'],
        repos: [{ name: 'toolbox-whatsapp', private: true }],
        year: 2026,
    },
    {
        slug: 'claude-tooling',
        title: 'AI Assistant Tooling',
        district: 'bots',
        summary: 'Custom MCP servers and skills that automate daily development work.',
        highlights: ['Project scaffolding skills', 'MCP integrations'],
        stack: ['TypeScript', 'MCP'],
        repos: [
            { name: 'claude-mcp', private: true },
            { name: 'claude-skills', private: true },
        ],
        year: 2026,
    },

    // Web3 Lab
    {
        slug: 'nft-metadata',
        title: 'NFT Metadata Generator',
        district: 'web3',
        summary: 'Generates NFT metadata for collections.',
        highlights: ['Batch metadata generation'],
        stack: ['JavaScript', 'NFT'],
        repos: [{ name: 'NFT-generate-metadata' }],
        year: 2023,
        featured: true,
    },
    {
        slug: 'solana-rust',
        title: 'Solana Rust App',
        district: 'web3',
        summary: 'Solana program written in Rust.',
        highlights: ['On-chain program'],
        stack: ['Rust', 'Solana'],
        repos: [{ name: 'solana_rust_app' }],
        year: 2025,
    },
    {
        slug: 'connect-wallet',
        title: 'Connect Wallet',
        district: 'web3',
        summary: 'Wallet connection experiments with MetaMask and global state.',
        highlights: ['MetaMask integration', 'Global wallet state'],
        stack: ['TypeScript', 'Web3'],
        repos: [{ name: 'connect-wallet' }, { name: 'connect-wallet-globals-metamask' }, { name: 'first_web3' }],
        year: 2025,
    },

    // IoT Flood Lab
    {
        slug: 'iot-banjir',
        title: 'IoT Flood Monitoring',
        district: 'iot',
        summary: 'Flood monitoring system with IoT sensors, a web dashboard and WebGIS maps.',
        highlights: ['Sensor data dashboard', 'WebGIS flood map'],
        stack: ['PHP', 'IoT', 'WebGIS'],
        repos: [
            { name: 'system-iot-banjir' },
            { name: 'system-banjir-iot' },
            { name: 'skripsi_iot' },
            { name: 'system-webgis-banjir', private: true },
            { name: 'IOT_BANJIR', private: true },
        ],
        year: 2024,
    },
    {
        slug: 'water-echoes',
        title: 'Water Echoes',
        district: 'iot',
        summary: 'Water monitoring app with a website and an Android client.',
        highlights: ['Web and Android apps'],
        stack: ['PHP', 'JavaScript', 'Android'],
        repos: [
            { name: 'waterEchoes.app' },
            { name: 'waterEchoes_Android' },
            { name: 'WaterEchoesMobile', private: true },
            { name: 'waterEchoesWebsite', private: true },
        ],
        year: 2023,
    },

    // Web Apps City
    {
        slug: 'omnitec',
        title: 'Omnitec',
        district: 'web',
        summary: 'Marketing site for a technology partner serving enterprise, government and SaaS teams.',
        highlights: ['Next.js 16, React 19, Tailwind v4, framer-motion'],
        stack: ['Next.js', 'Tailwind', 'framer-motion'],
        repos: [{ name: 'stackcraft_frontend' }],
        year: 2026,
    },
    {
        slug: 'warungku',
        title: 'Warungku',
        district: 'web',
        summary: 'Store and admin platform for small shops.',
        highlights: ['Storefront and admin apps', 'NestJS backends'],
        stack: ['Next.js', 'NestJS', 'TypeScript'],
        repos: [
            { name: 'frontend_warungku' },
            { name: 'backend_warungku' },
            { name: 'frontend-store-warungku' },
            { name: 'backend-store-warungku' },
        ],
        year: 2025,
    },
    {
        slug: 'peminjaman-gedung',
        title: 'Hall Booking System',
        district: 'web',
        summary: 'Booking system for a parish multipurpose hall.',
        highlights: ['Booking flow and admin'],
        stack: ['Next.js', 'NestJS'],
        repos: [
            { name: 'frontend-peminjaman-gedung' },
            { name: 'backend-peminjaman-gedung' },
            { name: 'frontend-gedung-serbaguna-paroki' },
        ],
        year: 2025,
    },
    {
        slug: 'maricarid',
        title: 'Maricarid',
        district: 'web',
        summary: 'Web platform with a Next.js frontend and its own backend.',
        highlights: ['Deployed on Vercel'],
        stack: ['Next.js', 'Node.js'],
        repos: [{ name: 'frontend_maricarid' }, { name: 'backend_maricarid' }],
        year: 2024,
    },
    {
        slug: 'rsud-aa',
        title: 'RSUD AA',
        district: 'web',
        summary: 'Hospital web system.',
        highlights: ['NestJS backend'],
        stack: ['NestJS', 'TypeScript'],
        repos: [{ name: 'rsud-aa-amirullazmi' }, { name: 'nest-backend-rsudaa' }],
        year: 2024,
    },
    {
        slug: 'jurusanku',
        title: 'JurusanKu',
        district: 'web',
        summary: 'Helps students explore study majors.',
        highlights: ['Next.js app'],
        stack: ['Next.js'],
        repos: [{ name: 'JurusanKu' }],
        year: 2024,
    },
    {
        slug: 'more-web',
        title: 'More Web Apps',
        district: 'web',
        summary: 'Other client and personal web apps.',
        highlights: ['Riverb, OnlyDeath, Embol, Weon, Labterpadu UNTAN, Spiritway'],
        stack: ['Next.js', 'NestJS', 'PHP', 'JavaScript'],
        repos: [
            { name: 'riverb-frontend' },
            { name: 'onlydeath-frontend' },
            { name: 'onlydeath-backend' },
            { name: 'Embol' },
            { name: 'weon-e' },
            { name: 'system-labterpadu-untan' },
            { name: 'frontend-spiritway' },
        ],
        year: 2026,
    },

    // Toolkit Dock
    {
        slug: 'golang-be-template',
        title: 'Golang Backend Template',
        district: 'toolkit',
        summary: 'Gin backend with clean architecture, Prisma migrations and a custom query builder.',
        highlights: ['Viper config', 'Repository / usecase / handler layers'],
        stack: ['Go', 'Gin', 'Prisma', 'PostgreSQL'],
        repos: [{ name: 'golang-be-template' }, { name: 'golang-restfull-api' }],
        year: 2026,
        featured: true,
    },
    {
        slug: 'coin-satelit-docs',
        title: 'Coin Satelit API Docs',
        district: 'toolkit',
        summary: 'API documentation site.',
        highlights: ['Hosted documentation'],
        stack: ['JavaScript'],
        repos: [{ name: 'coin-satelit-api-documentation', private: true }],
        year: 2025,
    },
];

export function districtOf(id: DistrictId): District {
    return districts.find((d) => d.id === id)!;
}

export function projectsIn(id: DistrictId): Project[] {
    return projects.filter((p) => p.district === id);
}

/** World position of each project building, laid out on a small grid around its district center. */
export const buildingPositions: Record<string, [number, number]> = (() => {
    const out: Record<string, [number, number]> = {};
    for (const d of districts) {
        const list = projectsIn(d.id);
        const cols = Math.ceil(Math.sqrt(list.length));
        const gap = 9;
        list.forEach((p, i) => {
            const c = i % cols;
            const r = Math.floor(i / cols);
            const rows = Math.ceil(list.length / cols);
            out[p.slug] = [
                d.position[0] + (c - (cols - 1) / 2) * gap,
                d.position[1] + (r - (rows - 1) / 2) * gap,
            ];
        });
    }
    return out;
})();
