'use client'

import ImageBackgroundLayout from '@/components/global/layout/ImageBackgroundLayout'
import useModal from '@/components/global/modal/hooks/useModal'

import RoomNewModal from '@/components/room/new/CreateRoomModal'
import { useEffect } from 'react'

export default function RoomNewPage() {
  const { isOpen, handleOpenModal, handleCloseModal } = useModal()

  useEffect(() => {
    handleOpenModal()
  }, [])

  return (
    <ImageBackgroundLayout>
      <RoomNewModal isOpen={isOpen} handleCloseModal={handleCloseModal} />
    </ImageBackgroundLayout>
  )
}
