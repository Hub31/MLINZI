/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment settings
  output: 'standalone',

  // Image optimization
  images: {
    unoptimized: true, // Required for static export fallback
    remotePatterns: [
      { hostname: 'maps.googleapis.com' },
      { hostname: 'rescue.mlinzi.app' },
    ],
  },

  // CORS headers for n8n integration
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Requested-With' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },

  // Environment variables exposed to client
  env: {
    NEXT_PUBLIC_APP_VERSION: '3.0.0',
    NEXT_PUBLIC_APP_NAME: 'Mlinzi',
    NEXT_PUBLIC_KENYA_DPA_COMPLIANT: 'true',
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
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization, X-Requested-With' },
          { key: 'Access-Control-Max-Age', value: '86400' },
        ],
      },
    ];
  },

  // Trailing slashes for SEO
  trailingSlash: true,

  // Compress responses
  compress: true,

  // Production source maps (disable for security)
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
