'use client'

import { useState } from 'react'

interface IModalHookProps {
  initialIsOpen?: boolean
}

export default function useModal({ initialIsOpen = false }: IModalHookProps = {}) {
  const [isOpen, setIsOpen] = useState(initialIsOpen)

  const handleOpenModal = () => setIsOpen(true)
  const handleCloseModal = () => setIsOpen(false)

  return {
    isOpen,
    handleOpenModal,
    handleCloseModal,
  }
}
