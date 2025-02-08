'use client'

import LogoIcon from '@/assets/svg/logo.svg'
import KakaoButton from '@/components/global/button/KakaoButton'
import Image from 'next/image'

export default function SignInPage() {
  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center bg-[url('/images/bg-image.jpg')]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#060812] via-[#060812E0] to-[#06081200]"></div>
      <div className="relative z-1 flex flex-col items-center">
        <Image src={LogoIcon} alt="로고" width={156} height={79} />
        <div className="mt-8 mb-[52px]">
          <p className="semi-24 text-grayscale-50 whitespace-pre-line text-center">
            간단하게 가입하고{'\n'}작업을 시작해볼까요?
          </p>
        </div>
        <KakaoButton handleClick={() => {}} />
      </div>
    </section>
  )
}
