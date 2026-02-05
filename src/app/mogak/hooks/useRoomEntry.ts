'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { postEnterRoom } from '@/app/api/home/api'

export default function useRoomEntry(roomId: string) {
  const router = useRouter()
  const [isRoomEntered, setIsRoomEntered] = useState(false)

  useEffect(() => {
    const enteredRoom = sessionStorage.getItem('enteredRoom')
    if (enteredRoom === roomId) {
      sessionStorage.removeItem('enteredRoom')
      setIsRoomEntered(true)
      return
    }

    const enterRoom = async () => {
      try {
        await postEnterRoom(Number(roomId), {
          isScreenShared: false,
          isVideoLargeAllowed: false,
        })
        setIsRoomEntered(true)
      } catch (error) {
        console.error('방 입장 실패:', error)
        router.replace('/')
      }
    }
    enterRoom()
  }, [roomId, router])

  return isRoomEntered
}
