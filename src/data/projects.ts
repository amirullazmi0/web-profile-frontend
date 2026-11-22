import { GITHUB_USER } from './profile';

export type DistrictId = 'fleet' | 'ai' | 'bots' | 'web3' | 'gov' | 'commerce' | 'toolkit';

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
 * `owner` defaults to the personal account; org repos set it.
 */
export type Repo = { name: string; owner?: string; private?: false } | { name: string; owner?: string; private: true };

export interface Shot {
    src: string;
    caption: string;
}

export interface Project {
    slug: string;
    title: string;
    district: DistrictId;
    summary: string;
    highlights: string[];
    stack: string[];
    repos: Repo[];
    year: number;
    /** Commits by me across the project's repos (from GitHub contributors). */
    commits: number;
    /** Organization the work was done under, if any. */
    org?: string;
    logo?: string;
    /** Public product URL (never a private repo link). */
    liveUrl?: string;
    shots?: Shot[];
    featured?: boolean;
}

/** GitHub link for a public repo, or null for a private one. */
export function repoUrl(repo: Repo): string | null {
    if (repo.private) return null;
    return `https://github.com/${repo.owner ?? GITHUB_USER}/${repo.name}`;
}

export const districts: District[] = [
    {
        id: 'gov',
        name: 'HealthTech',
        blurb: 'Hospital systems for RSUD dr. Abdul Aziz.',
        color: '#d4a03a',
        position: [0, -46],
    },
    {
        id: 'ai',
        name: 'AI & Data Intelligence',
        blurb: 'Regulation intelligence, computer vision and data products.',
        color: '#8b5cf6',
        position: [40, -24],
    },
    {
        id: 'bots',
        name: 'Automation & Bots',
        blurb: 'Bots and services that run on their own.',
        color: '#06b6d4',
        position: [42, 22],
    },
    {
        id: 'web3',
        name: 'Web3 Lab',
        blurb: 'Solana trading automation and NFT tooling.',
        color: '#a855f7',
        position: [4, 46],
    },
    {
        id: 'fleet',
        name: 'Logistics & Telematics',
        blurb: 'Depots, vessels, fleets and the trackers that feed them.',
        color: '#f59e0b',
        position: [-38, 28],
    },
    {
        id: 'commerce',
        name: 'Enterprise & Commerce',
        blurb: 'ERP and CRM ecosystems, stores and booking platforms.',
        color: '#10b981',
        position: [-42, -18],
    },
    {
        id: 'toolkit',
        name: 'Toolkit Dock',
        blurb: 'Backend foundations reused across projects.',
        color: '#64748b',
        position: [-18, -42],
    },
];

export const projects: Project[] = [
    // HealthTech
    {
        slug: 'si-kain-raja',
        title: 'SI KAIN RAJA',
        district: 'gov',
        org: 'RSUD dr. Abdul Aziz',
        summary:
            'Integrated information and education system for inpatient and outpatient care at RSUD dr. Abdul Aziz Singkawang: room availability, clinics, lab, radiology and ambulance rates, blood donors and a hospital map.',
        highlights: ['Live room availability and clinic schedules', 'Lab, radiology, procedure and ambulance rates', 'Installable PWA'],
        stack: ['Next.js', 'TypeScript', 'SCSS'],
        repos: [{ name: 'FrontEnd-siKainRaja', owner: 'RSUD-ABDUL-AZIZ-UNOFFICIALLY' }],
        year: 2026,
        commits: 59,
        logo: '/logos/sikainraja.webp',
        liveUrl: 'https://kainraja.spairum.my.id',
        featured: true,
        shots: [
            { src: '/shots/kainraja.webp', caption: 'Patient information home' },
            { src: '/shots/kainraja-kamar.webp', caption: 'Live room availability per ward' },
            { src: '/shots/kainraja-poli.webp', caption: 'Clinic information' },
            { src: '/shots/kainraja-lab.webp', caption: 'Lab test rates' },
        ],
    },
    {
        slug: 'rsud-profile',
        title: 'RSUD Hospital Portal',
        district: 'gov',
        org: 'RSUD dr. Abdul Aziz',
        summary:
            'Hospital portal with public pages for services, schedules and announcements, an admin dashboard for content, and a NestJS API.',
        highlights: ['Admin CMS for articles, staff and services', 'NestJS backend', 'Dashboard for the Hardin service'],
        stack: ['Next.js', 'NestJS', 'Tailwind', 'TypeScript'],
        repos: [
            { name: 'profile-rsudaa', owner: 'RSUD-ABDUL-AZIZ-UNOFFICIALLY' },
            { name: 'nest-backend-rsudaa', owner: 'RSUD-ABDUL-AZIZ-UNOFFICIALLY' },
            { name: 'dashboard-hardin', owner: 'RSUD-ABDUL-AZIZ-UNOFFICIALLY' },
        ],
        year: 2026,
        commits: 126,
        logo: '/logos/rsudaa.webp',
        liveUrl: 'https://rsudaa.singkawangkota.go.id',
        shots: [{ src: '/shots/rsud.webp', caption: 'Public service website' }],
        featured: true,
    },

    // AI & Data Intelligence
    {
        slug: 'alignment-intelligence',
        title: 'Alignment Intelligence',
        district: 'ai',
        summary:
            'Regulatory intelligence workspace: reads how regulations relate, finds policy gaps and writes analysis with article references. A collector crawls JDIHN and feeds the knowledge library.',
        highlights: [
            'JDIHN crawler with PostgreSQL checkpoints, no browser automation',
            'Per-ministry cron schedules with a live log stream',
            'Python, NestJS and Next.js services',
        ],
        stack: ['Python', 'NestJS', 'Next.js', 'PostgreSQL'],
        repos: [
            { name: 'alignment-intelligence-nest', private: true },
            { name: 'alignment-intelligence-next', private: true },
            { name: 'alignment-intelligence-collector' },
            { name: 'alignment-intelligence-cron' },
        ],
        year: 2026,
        commits: 77,
        logo: '/logos/alignment.svg',
        shots: [
            { src: '/shots/alignment.webp', caption: 'Workspace sign-in' },
            { src: '/shots/alignment-cron.webp', caption: 'JDIHN collector dashboard' },
        ],
        featured: true,
    },
    {
        slug: 'andalalin',
        title: 'LUMA.io — Andalalin Traffic Counter',
        district: 'ai',
        summary:
            'Counts vehicles in traffic survey videos with YOLO and ByteTrack, aggregates intervals and generates an analysis workbook.',
        highlights: ['Resumable chunked video upload', 'Two-direction counting line', 'MC / LV / HV classification'],
        stack: ['Python', 'FastAPI', 'YOLO', 'ByteTrack', 'Next.js'],
        repos: [{ name: 'andalalin-detector-be' }, { name: 'andalalin-detector-frontend', private: true }],
        year: 2026,
        commits: 109,
        featured: true,
        shots: [
            { src: '/shots/app-luma-dashboard.webp', caption: 'Dashboard: detections, quota, recent jobs (demo data)' },
            { src: '/shots/app-luma-projects.webp', caption: 'Projects list (demo data)' },
            { src: '/shots/app-luma-home.webp', caption: 'Upload a traffic video to detect' },
        ],
    },
    {
        slug: 'lead-ai',
        title: 'Lead.AI',
        district: 'ai',
        org: 'LEAD-AI-PROJECT',
        summary: 'Data cleaning services for pharma and biotech AI teams, in collaboration with NUS and ITB.',
        highlights: ['Marketing site and app', 'NestJS backend'],
        stack: ['Next.js', 'NestJS', 'TypeScript'],
        repos: [
            { name: 'lead-ai-frontend', owner: 'LEAD-AI-PROJECT' },
            { name: 'lead-ai-backend', owner: 'LEAD-AI-PROJECT', private: true },
        ],
        year: 2025,
        commits: 98,
        logo: '/logos/lead-ai.webp',
        liveUrl: 'https://lead-ai-rho.vercel.app',
        shots: [{ src: '/shots/lead-ai.webp', caption: 'Landing page' }],
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
        commits: 2,
        shots: [
            { src: '/shots/illus-leakage.webp', caption: 'Illustration: WhatsApp report to daily recap' },
        ],
    },

    // Automation & Bots
    {
        slug: 'orbie',
        title: 'Orbie Bot',
        district: 'bots',
        org: 'Zenika Ruang Kreasi',
        summary: 'Go bot service with HTTP and gRPC transports, Midtrans payments and Prometheus metrics.',
        highlights: ['Clean architecture with gRPC clients', 'Midtrans payment integration', 'Infrastructure as code'],
        stack: ['Go', 'Gin', 'gRPC', 'PostgreSQL', 'Midtrans'],
        repos: [{ name: 'orbie_bot', owner: 'ZenikaRuangKreasi', private: true }],
        year: 2025,
        commits: 78,
        shots: [
            { src: '/shots/illus-orbie.webp', caption: 'Illustration: service architecture' },
        ],
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
        commits: 22,
        shots: [
            { src: '/shots/illus-toolbox.webp', caption: 'Illustration: collector to MCP pipeline' },
        ],
    },
    {
        slug: 'ai-tooling',
        title: 'AI Dev Tooling',
        district: 'bots',
        summary: 'Custom MCP servers and skills that scaffold projects and automate daily development work.',
        highlights: ['Full-stack scaffolding (Next + Go / Nest)', 'Release automation'],
        stack: ['TypeScript', 'MCP'],
        repos: [
            { name: 'claude-skills', private: true },
            { name: 'claude-mcp', private: true },
        ],
        year: 2026,
        commits: 20,
        shots: [
            { src: '/shots/illus-tooling.webp', caption: 'Illustration: scaffolding a full-stack project' },
        ],
    },

    // Web3 Lab
    {
        slug: 'masoul-sniper',
        title: 'MaSoul Sniper',
        district: 'web3',
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
        commits: 157,
        logo: '/logos/solana.svg',
        featured: true,
        shots: [
            { src: '/shots/illus-masoul.webp', caption: 'Illustration: Telegram control and trade pipeline' },
        ],
    },
    {
        slug: 'nft-metadata',
        title: 'NFT Metadata Generator',
        district: 'web3',
        summary:
            'Generates NFT collections from art layers (background, skin, outfit, eyes, mouth, glasses, headwear) with rarity-weighted traits and metadata.',
        highlights: ['Rarity weights per trait', '3000×3000 artwork with matching metadata JSON', 'Batch generation of 200 editions'],
        stack: ['JavaScript', 'Node.js', 'Canvas', 'NFT'],
        repos: [{ name: 'NFT-generate-metadata' }],
        year: 2023,
        commits: 5,
        shots: [
            { src: '/shots/nft-collection.webp', caption: 'Generated collection' },
            { src: '/shots/nft/nft-1.webp', caption: 'Edition: Afro Cut, Elon shade, Black Hoodie' },
            { src: '/shots/nft/nft-4.webp', caption: 'Edition: Balaclava, Dead Inside, Basketball Jersey' },
            { src: '/shots/nft/nft-3.webp', caption: 'Edition: Long hair cap, Hexagon shades, Backpack' },
        ],
    },

    // Logistics & Telematics
    {
        slug: 'ids',
        title: 'IDS — Integrated Depot System',
        district: 'fleet',
        org: 'Samudera Indonesia Group',
        summary:
            'Integrated system for container depot operations at Samudera Indonesia Group: container, vessel and depot management with IoT from the depot floor and management reporting.',
        highlights: [
            'NestJS and Go services for logistics and maritime operations',
            'IoT integrated into physical depot infrastructure for real-time monitoring',
            'JasperReports modules for management analytics',
        ],
        stack: ['NestJS', 'Go', 'Next.js', 'IoT', 'JasperReports'],
        logo: '/logos/samudera-mark.webp',
        repos: [],
        year: 2026,
        commits: 0,
        featured: true,
        shots: [
            { src: '/shots/illus-ids.webp', caption: 'Illustration: depot yard, gate and IoT overview' },
        ],
    },
    {
        slug: 'fms',
        title: 'FMS — Fleet Management System',
        district: 'fleet',
        summary:
            'Fleet platform for mining haulage: GPS trackers connect over raw TCP to a Go backend, and every trip from pit to stockpile is recorded with duration, distance and fuel.',
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
        commits: 71,
        logo: '/logos/fms.svg',
        shots: [
            { src: '/shots/fms-admin.webp', caption: 'Administrator app' },
            { src: '/shots/fms-supervisor.webp', caption: 'Supervisor app' },
        ],
        featured: true,
    },
    {
        slug: 'vms',
        title: 'VMS — Vessel Monitoring System',
        district: 'fleet',
        summary:
            'Vessel monitoring on one map: position, speed and heading of every tugboat and barge live from Teltonika trackers, plus fuel use per engine calibrated against fuel models, with records and alerts.',
        highlights: [
            'Vessels, engines and devices management',
            'Fuel models with tank calibration tables',
            'Fuel records and anomaly alerts',
        ],
        stack: ['Go', 'Gin', 'PostgreSQL', 'Next.js'],
        repos: [
            { name: 'vms-backend', private: true },
            { name: 'vms-frontend', private: true },
        ],
        year: 2026,
        commits: 30,
        shots: [
            { src: '/shots/app-vms-map.webp', caption: 'Live fleet map (demo data)' },
            { src: '/shots/app-vms-vessels.webp', caption: 'Vessel registry (demo data)' },
            { src: '/shots/app-vms-home.webp', caption: 'Sign-in' },
        ],
    },

    // Enterprise & Commerce
    {
        slug: 'amani',
        title: 'Amani Admin Platform',
        district: 'commerce',
        org: 'PT Amani Group Indonesia',
        summary:
            'Ecosystem of 8+ business apps (CRM, ERP, supplier management) tied together by an admin platform that centralizes workflows for eight stakeholder groups.',
        highlights: [
            'RabbitMQ messaging between services',
            'Real-time updates with Server-Sent Events',
            'Atomic Design frontend; legacy CRM modules modernized',
        ],
        stack: ['NestJS', 'Next.js', 'RabbitMQ', 'SSE', 'PostgreSQL'],
        repos: [],
        year: 2025,
        commits: 0,
        featured: true,
        shots: [
            { src: '/shots/illus-amani.webp', caption: 'Illustration: admin hub over 8+ apps' },
        ],
    },
    {
        slug: 'kratify',
        title: 'Kratify',
        district: 'commerce',
        org: 'Kratify',
        summary: 'Export storefront for Indonesian kratom: catalog, cart, international orders, Midtrans payments and Biteship shipping, on a Go backend and Next.js frontend.',
        highlights: ['Midtrans payment flow', 'Biteship shipping rates and tracking', 'Redis rate limiting, Swagger docs'],
        stack: ['Go', 'Gin', 'PostgreSQL', 'Redis', 'Next.js'],
        repos: [
            { name: 'kratify-backend', owner: 'Kratify-org', private: true },
            { name: 'kratify-frontend', owner: 'Kratify-org', private: true },
        ],
        year: 2026,
        commits: 358,
        featured: true,
        shots: [
            { src: '/shots/app-kratify-catalog.webp', caption: 'Catalog with discounts and wishlist (demo data)' },
            { src: '/shots/app-kratify-detail.webp', caption: 'Product detail with international quote (demo data)' },
            { src: '/shots/app-kratify-home.webp', caption: 'Storefront home' },
            { src: '/shots/app-kratify-home-products.webp', caption: 'Why Kratify: quality, transparency, sourcing' },
        ],
    },
    {
        slug: 'onlydeath',
        title: 'OnlyDeath Records',
        district: 'commerce',
        summary: 'Online store for an independent record label: catalog, cart, checkout and order tracking.',
        highlights: ['Product catalog and cart', 'Order tracking page', 'NestJS backend'],
        stack: ['Next.js', 'NestJS', 'TypeScript'],
        repos: [{ name: 'onlydeath-frontend' }, { name: 'onlydeath-backend' }],
        year: 2026,
        commits: 32,
        logo: '/logos/onlydeath.webp',
        liveUrl: 'https://onlydeathrecords.com',
        shots: [
            { src: '/shots/onlydeath.webp', caption: 'Home' },
            { src: '/shots/onlydeath-catalog.webp', caption: 'Catalog' },
        ],
    },
    {
        slug: 'peminjaman-gedung',
        title: 'Hall Booking System',
        district: 'commerce',
        summary: 'Booking system for a parish multipurpose hall, from request to approval.',
        highlights: ['Booking flow and admin approval', 'NestJS backend'],
        stack: ['Next.js', 'NestJS', 'TypeScript'],
        repos: [{ name: 'frontend-peminjaman-gedung' }, { name: 'backend-peminjaman-gedung' }],
        year: 2025,
        commits: 210,
        logo: '/logos/peminjaman.webp',
        shots: [
            { src: '/shots/app-hall-list.webp', caption: 'Hall listing with prices and addresses (demo data)' },
        ],
    },
    {
        slug: 'warungku',
        title: 'Warungku',
        district: 'commerce',
        summary: 'Storefront and admin platform for small shops.',
        highlights: ['Storefront and admin apps', 'NestJS backends'],
        stack: ['Next.js', 'NestJS', 'TypeScript'],
        repos: [
            { name: 'frontend_warungku' },
            { name: 'backend_warungku' },
            { name: 'frontend-store-warungku' },
            { name: 'backend-store-warungku' },
        ],
        year: 2025,
        commits: 68,
        shots: [
            { src: '/shots/app-warung-store.webp', caption: 'Store inventory: stock, price, actions (demo data)' },
        ],
    },
    {
        slug: 'maricar',
        title: 'Maricar',
        district: 'commerce',
        summary: 'Company site for an integrated marine and logistics services group.',
        highlights: ['Marine traffic, gallery and services pages', 'Deployed on Vercel'],
        stack: ['Next.js', 'Node.js'],
        repos: [{ name: 'frontend_maricarid' }, { name: 'backend_maricarid' }],
        year: 2024,
        commits: 57,
        logo: '/logos/maricar.webp',
        liveUrl: 'https://frontend-maricarid.vercel.app',
        shots: [{ src: '/shots/maricar.webp', caption: 'Home page' }],
    },

    // Toolkit Dock
    {
        slug: 'golang-be-template',
        title: 'Golang Backend Template',
        district: 'toolkit',
        summary:
            'Gin backend with clean architecture, Prisma migrations and a custom query builder. The base for Kratify and VMS.',
        highlights: ['Viper config', 'Repository / usecase / handler layers'],
        stack: ['Go', 'Gin', 'Prisma', 'PostgreSQL'],
        repos: [{ name: 'golang-be-template' }],
        year: 2026,
        commits: 11,
        featured: true,
        shots: [
            { src: '/shots/illus-golang.webp', caption: 'Illustration: project layout and dev server' },
        ],
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
