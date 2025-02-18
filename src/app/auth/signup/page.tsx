'use client'
import { useEffect, useState } from 'react'

import { ToastSize, ToastTheme } from '@/components/global/toast/toast.types'
import ImageBackgroundLayout from '@/components/global/layout/ImageBackgroundLayout'
import useModal from '@/components/global/modal/hooks/useModal'
import SignUpModal from '@/components/auth/SignUpModal'
import IconToast from '@/components/global/toast/IconToast'

export default function SignUpPage() {
  const { isOpen, handleOpenModal, handleCloseModal } = useModal()
  const [isToastShow, setIsToastShow] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  useEffect(() => {
    handleOpenModal()
  }, [])

  const showToastMessage = (message: string) => {
    setToastMsg(message)
    setIsToastShow(true)
  }

  const handleSignIn = () => {
    setIsSignUp(true)
  }

  return (
    <ImageBackgroundLayout isSignUp={isSignUp}>
      <SignUpModal
        isOpen={isOpen}
        handleCloseModal={handleCloseModal}
        showToastMessage={showToastMessage}
        handleSignIn={handleSignIn}
      />
      {isToastShow && (
        <IconToast
          theme={ToastTheme.LIGHT}
          size={ToastSize.md}
          text=""
          detailText={toastMsg}
          handleClick={() => setIsToastShow(false)}
        />
      )}
    </ImageBackgroundLayout>
  )
}
