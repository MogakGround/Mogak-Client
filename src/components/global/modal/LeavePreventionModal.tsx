import React from 'react'
import Modal, { ModalBackground } from './Modal'
import BasicButton from '../button/BasicButton'
import { ButtonSize, ButtonTheme, ButtonVariant } from '../button/button.types'

interface LeavePreventionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  message?: string
}

export default function LeavePreventionModal({
  isOpen,
  onClose,
  onConfirm,
  title = '모각방에서 나가시겠습니까?',
  message = '',
}: LeavePreventionModalProps) {
  return (
    <Modal isOpen={isOpen} handleCloseModal={onClose} backgroundColor={ModalBackground.gray700}>
      <div className="flex flex-col items-center p-6">
        <h3 className="text-lg font-semibold  mb-2">{title}</h3>
        <p className="text-sm text-grayscale-200 text-center mb-6">{message}</p>

        <div className="flex gap-3 w-full mt-[20px]">
          <BasicButton
            variant={ButtonVariant.default}
            theme={ButtonTheme.text}
            size={ButtonSize.md}
            handleClick={onClose}
            className="flex-1"
            text="취소"
          ></BasicButton>
          <BasicButton
            variant={ButtonVariant.default}
            theme={ButtonTheme.primary}
            size={ButtonSize.md}
            handleClick={onConfirm}
            className="flex-1"
            text="나가기"
          ></BasicButton>
        </div>
      </div>
    </Modal>
  )
}
