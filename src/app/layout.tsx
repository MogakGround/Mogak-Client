import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

import GNB from '@/components/layout/GNB'

const pretendard = localFont({
  src: [
    { path: '../../public/fonts/Pretendard-Regular.woff', weight: '400', style: 'normal' },
    { path: '../../public/fonts/Pretendard-Medium.woff', weight: '500', style: 'normal' },
    { path: '../../public/fonts/Pretendard-SemiBold.woff', weight: '600', style: 'normal' },
    { path: '../../public/fonts/Pretendard-Bold.woff', weight: '700', style: 'normal' },
  ],
  variable: '--font-pretendard',
})

const riaSans = localFont({
  src: '../../public/fonts/RiaSans-ExtraBold.ttf',
  weight: '800',
  style: 'normal',
  variable: '--font-riasans',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${riaSans.variable}`}>
      <body className={`${pretendard.className} flex flex-col min-h-screen bg-bg`}>
        <div id="portalModal" />
        <GNB />
        <main className="w-full flex-1">{children}</main>
      </body>
    </html>
  )
}
