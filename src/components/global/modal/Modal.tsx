'use client'

import { useEffect, useRef } from 'react'
import Portal from './Portal'

interface IModalProps {
  isOpen: boolean
  handleCloseModal: () => void
  children: React.ReactNode
}

export default function Modal({ isOpen, handleCloseModal, children }: IModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseModal()
      }
    }

    window.addEventListener('keydown', handleKeyDown as unknown as EventListener)
    return () => window.removeEventListener('keydown', handleKeyDown as unknown as EventListener)
  }, [isOpen, handleCloseModal])

  useEffect(() => {
    if (!isOpen) return

    modalRef.current?.focus()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <Portal>
      <div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
        onClick={handleCloseModal}
      >
        <div
          ref={modalRef}
          tabIndex={-1}
          className="relative p-6 z-50 bg-grayscale-700 shadow-lg rounded-[20px] w-[416px]"
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>
    </Portal>
  )
}
