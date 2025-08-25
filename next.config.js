/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Image optimization
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  
  experimental: {
    // Support both App Router and Pages Router
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
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