'use client'
import { ChangeEvent, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { postAuthSignUp } from '@/app/api/auth/api'

import { ToastSize, ToastTheme } from '@/components/global/toast/toast.types'
import useToast from '@/components/global/toast/hooks/useToast'
import Modal, { ModalBackground } from '@/components/global/modal/Modal'
import AutoDisappearIconToast from '@/components/global/toast/AutoDisappearIconToast'
import SignUpComplete from './SignUpComplete'
import SignUpForm from './SignUpForm'

interface SignUpModalProps {
  isOpen: boolean
  handleCloseModal: () => void
  handleSignUpChange: () => void
}
export interface IFormInputProps {
  value: string
  name: string
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function SignUpModal({ isOpen, handleCloseModal, handleSignUpChange }: SignUpModalProps) {
  const { isToastShow, toastMessage, handleShowIconToast, handleCloseToast, handleResetToast } = useToast()
  const [signUpForm, setSignUpForm] = useState({ nickname: '', portfolioLink: '' })
  const [isSignUpComplete, setIsSignUpComplete] = useState(false)

  const searchParams = useSearchParams()
  const kakaoId = searchParams.get('kakaoId')

  const handleSignUpComplete = async () => {
    try {
      await postAuthSignUp({
        kakaoId: kakaoId ?? '',
        nickName: signUpForm.nickname,
        portfolioUrl: signUpForm.portfolioLink,
      })
    } catch (error) {
      console.error(error)
    }
    handleSignUpChange()
    setIsSignUpComplete(true)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <Modal
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
        hasOverlay={false}
        closeOnOutsideClick={false}
        backgroundColor={isSignUpComplete ? ModalBackground.gray800 : ModalBackground.gray700}
        renderBottomFn={() => {
          return (
            <>
              {isToastShow && (
                <div className="w-[416px] mt-[16px] !text-grayscale-50 cursor-default">
                  <AutoDisappearIconToast
                    key={toastMessage.text}
                    duration={5000}
                    theme={ToastTheme.LIGHT}
                    size={ToastSize.sm}
                    text={toastMessage.text}
                    success={toastMessage.success}
                    handleClick={handleCloseToast}
                  />
                </div>
              )}
            </>
          )
        }}
      >
        {isSignUpComplete ? (
          <SignUpComplete />
        ) : (
          <SignUpForm
            handleShowIconToast={handleShowIconToast}
            handleResetToast={handleResetToast}
            handleSignUpComplete={handleSignUpComplete}
            signUpForm={signUpForm}
            setSignUpForm={setSignUpForm}
          />
        )}
      </Modal>
    </div>
  )
}
