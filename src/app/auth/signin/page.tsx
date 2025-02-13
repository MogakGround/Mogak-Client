'use client'

import { useState } from 'react'
import Image from 'next/image'
import LogoIcon from '@/assets/svg/logo.svg'
import { ToastSize, ToastTheme } from '@/components/global/toast/toast.types'
import KakaoButton from '@/components/global/button/KakaoButton'
import useModal from '@/components/global/modal/hooks/useModal'
import SignUpModal from '@/components/auth/SignUpModal'
import IconToast from '@/components/global/toast/IconToast'

export default function SignInPage() {
  const { isOpen, handleOpenModal, handleCloseModal } = useModal()
  const [isToastShow, setIsToastShow] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [isSignIn, setIsSignIn] = useState(false)

  const showToastMessage = (message: string) => {
    setToastMsg(message)
    setIsToastShow(true)
  }

  const handleSignIn = () => {
    setIsSignIn(true)
  }

  return (
    <section className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center bg-[url('/images/bg-image.jpg')]">
      <div className="absolute inset-0 top-0 w-full h-full overflow-hidden">
        {isSignIn && (
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(3, 236, 214, 0.50) 0%, rgba(255, 84, 84, 0.50) 100%)',
              filter: 'blur(160px)',
              opacity: 0.7,
            }}
          ></div>
        )}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(0deg, #060812 0%, rgba(6, 8, 18, 0.85) 40%, rgba(6, 8, 18, 0.00) 100%)',
          }}
        ></div>
      </div>
      <div className="relative z-1 flex flex-col items-center">
        <Image src={LogoIcon} alt="로고" width={156} height={79} />
        <div className="mt-[32px] mb-[52px]">
          <p className="semi-24 text-grayscale-50 whitespace-pre-line text-center">
            간단하게 가입하고{'\n'}작업을 시작해볼까요?
          </p>
        </div>
        <KakaoButton handleClick={handleOpenModal} />
      </div>
      <SignUpModal
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
        showToastMessage={showToastMessage}
        handleSignIn={handleSignIn}
      />
      {isToastShow && (
        <IconToast
          theme={ToastTheme.LIGHT}
          size={ToastSize.lg}
          text=""
          detailText={toastMsg}
          handleClick={() => setIsToastShow(false)}
        />
      )}
    </section>
  )
}
