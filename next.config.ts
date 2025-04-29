import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['mogak-bucket.s3.ap-northeast-2.amazonaws.com'], // 여기에 사용하려는 도메인 추가
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
