import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  allowedDevOrigins: ['*'],
  async redirects() {
    return [
      {
        source: '/admin/super',
        destination: '/superadmin',
        permanent: true,
      },
      {
        source: '/admin/superadmin',
        destination: '/superadmin',
        permanent: true,
      },
      {
        source: '/admin/super/users',
        destination: '/superadmin/users',
        permanent: true,
      },
      {
        source: '/admin/super/settings',
        destination: '/superadmin/settings',
        permanent: true,
      },
      {
        source: '/admin/super/events',
        destination: '/superadmin',
        permanent: true,
      },
      {
        source: '/superadmin/events',
        destination: '/events',
        permanent: false,
      },
      {
        source: '/admin/events',
        destination: '/events',
        permanent: false,
      },
      {
        source: '/admin/scan',
        destination: '/superadmin/scan',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
