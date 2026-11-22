import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // Standalone output keeps the Docker runner image small: it ships only the
    // traced server files instead of the whole node_modules.
    output: 'standalone',
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
