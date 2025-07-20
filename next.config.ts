import type { NextConfig } from 'next'

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mn86.tonkotsu.jp',
        port: '',
        pathname: '/img/**',
      },
    ],
  },
}

export default nextConfig
