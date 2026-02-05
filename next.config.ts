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
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module.rules.find(
      (rule: any) => rule.test?.test?.('.svg'),
    )

    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/
    }

    return config
  },
}

export default nextConfig
