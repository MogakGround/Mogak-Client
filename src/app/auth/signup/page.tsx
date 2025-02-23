'use client'
import { useEffect, useState } from 'react'

import ImageBackgroundLayout from '@/components/global/layout/ImageBackgroundLayout'
import useModal from '@/components/global/modal/hooks/useModal'
import SignUpModal from '@/app/auth/components/SignUpModal'

export default function SignUpPage() {
  const { isOpen, handleOpenModal, handleCloseModal } = useModal()
  const [isSignUpComplete, setIsSignUpComplete] = useState(false)

  useEffect(() => {
    handleOpenModal()
  }, [])

  const handleSignUpChange = () => {
    setIsSignUpComplete(true)
  }

  return (
    <ImageBackgroundLayout isSignUp={isSignUpComplete}>
      <SignUpModal isOpen={isOpen} handleCloseModal={handleCloseModal} handleSignUpChange={handleSignUpChange} />
    </ImageBackgroundLayout>
  )
}
