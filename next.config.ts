import type { NextConfig } from 'next'

// 자체 서명 인증서를 사용하는 OpenVidu 서버 연결을 위해 SSL 검증 비활성화
if (process.env.NODE_ENV === 'development' || process.env.SKIP_SSL_VALIDATION === 'true') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

const nextConfig: NextConfig = {
  images: {
    domains: ['mogak-bucket.s3.ap-northeast-2.amazonaws.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
