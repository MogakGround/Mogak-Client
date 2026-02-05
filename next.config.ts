import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['mogak-bucket.s3.ap-northeast-2.amazonaws.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
}

export default nextConfig
