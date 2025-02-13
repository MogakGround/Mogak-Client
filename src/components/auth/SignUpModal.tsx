import Modal, { ModalBackground } from '@/components/global/modal/Modal'
import { ChangeEvent, useState } from 'react'
import SignUpComplete from './SignUpComplete'
import SignUpForm from './SignUpForm'

interface SignUpModalProps {
  isOpen: boolean
  handleCloseModal: () => void
  handleSignIn: () => void
  showToastMessage: (message: string) => void
}
export interface IFormInputProps {
  value: string
  name: string
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function SignUpModal({ isOpen, handleCloseModal, handleSignIn, showToastMessage }: SignUpModalProps) {
  const [isSignUpComplete, setIsSignUpComplete] = useState(false)

  const handleSignUpComplete = () => {
    handleSignIn()
    setIsSignUpComplete(true)
  }
  return (
    <Modal
      isOpen={isOpen}
      handleCloseModal={handleCloseModal}
      hasOverlay={false}
      closeOnOutsideClick={false}
      backgroundColor={isSignUpComplete ? ModalBackground.gray800 : ModalBackground.gray700}
    >
      {isSignUpComplete ? (
        <SignUpComplete />
      ) : (
        <SignUpForm
          handleCloseModal={handleCloseModal}
          showToastMessage={showToastMessage}
          handleSignUpComplete={handleSignUpComplete}
        />
      )}
    </Modal>
  )
}
