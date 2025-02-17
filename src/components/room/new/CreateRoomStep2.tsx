import { useState } from 'react'
import Image from 'next/image'
import cn from '@/utils/cn'

import { THUMBNAIL_LIST } from '@/constants/Room'
import { IRoomNewForm, RoomNewStatus } from './hooks/useCreateRoom'
import RoomNewButtonGroup from './CreateRoomBtnGroup'

interface ICreateRoomStep2Props {
  roomNewForm: IRoomNewForm
  setRoomNewForm: (roomNewForm: IRoomNewForm) => void
  roomStatusChange: (status: RoomNewStatus) => void
}

export default function CreateRoomStep2({ roomNewForm, setRoomNewForm, roomStatusChange }: ICreateRoomStep2Props) {
  const [selectedThumbnail, setSelectedThumbnail] = useState<string>(roomNewForm.thumbnail)

  const handleSelectThumbnail = (id: string) => {
    setSelectedThumbnail(id)
    setRoomNewForm({ ...roomNewForm, thumbnail: id })
  }

  return (
    <div className="flex gap-[12px] flex-wrap">
      {THUMBNAIL_LIST.map((thumbnail) => (
        <div
          key={thumbnail.id}
          className={cn(
            `w-[178px] h-[94px] rounded-[8px] overflow-hidden`,
            selectedThumbnail === thumbnail.id && 'border-[1.5px] border-accentT-50'
          )}
          onClick={() => handleSelectThumbnail(thumbnail.id)}
        >
          <Image src={thumbnail.image} alt="thumbnail" width={179} height={94} />
        </div>
      ))}
      <RoomNewButtonGroup previousStatus="step1" nextStatus="step3" roomStatusChange={roomStatusChange} />
    </div>
  )
}
