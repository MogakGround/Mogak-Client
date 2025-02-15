'use client'
import { useState } from 'react'

import { ToastSize, ToastTheme } from '@/components/global/toast/toast.types'
import useModal from '@/components/global/modal/hooks/useModal'
import SignUpModal from '@/components/auth/SignUpModal'
import IconToast from '@/components/global/toast/IconToast'
import AuthLayout from '@/components/auth/AuthLayout'

export default function SignUpPage() {
  const { isOpen, handleCloseModal } = useModal({ initialIsOpen: true })
  const [isToastShow, setIsToastShow] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const showToastMessage = (message: string) => {
    setToastMsg(message)
    setIsToastShow(true)
  }

  const handleSignIn = () => {
    setIsSignUp(true)
  }

  return (
    <AuthLayout isSignUp={isSignUp}>
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
    </AuthLayout>
  )
}
