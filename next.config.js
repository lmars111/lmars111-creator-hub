/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Support both App Router and Pages Router
  },
  async rewrites() {
    return [
      // Rewrite creator pages to use dynamic routing
      {
        source: '/c/:handle',
        destination: '/creator/:handle',
      },
      {
        source: '/c/:handle/chat',
        destination: '/creator/:handle/chat',
      },
    ];
  },
};

module.exports = nextConfig;