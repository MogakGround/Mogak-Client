import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import GNB from '@/components/layout/GNB'
import QueryProvider from '@/lib/QueryProvider'

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
  title: '모각작 - 함께 작업하는 공간',
  description: '모각작에서 함께 작업하고, 서로의 진행 상황을 확인하세요.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${riaSans.variable}`}>
      <body className={`${pretendard.className} flex flex-col min-h-screen bg-bg`}>
        <QueryProvider>
          <div id="portalModal" />
          <GNB />
          <main className="w-full h-[calc(100%-60px)] overflow-y-auto pb-50">{children}</main>
        </QueryProvider>
      </body>
    </html>
  )
}
