import { useState } from 'react'
import { getCheckRoomName } from '@/app/api/room/api'

interface UseRoomNameCheckReturn {
  isRoomNameChecked: boolean
  isLoading: boolean
  checkRoomNameAvailability: (roomName: string) => Promise<boolean>
  resetRoomNameCheck: () => void
}

export const useRoomNameCheck = (): UseRoomNameCheckReturn => {
  const [isRoomNameChecked, setIsRoomNameChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checkRoomNameAvailability = async (roomName: string): Promise<boolean> => {
    if (!roomName.trim()) return false

    setIsLoading(true)
    try {
      await getCheckRoomName({ roomName })
      setIsRoomNameChecked(true)
      return true
    } catch (error) {
      if (error instanceof Error) {
        setIsRoomNameChecked(false)
        throw error
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const resetRoomNameCheck = () => {
    setIsRoomNameChecked(false)
  }

  return {
    isRoomNameChecked,
    isLoading,
    checkRoomNameAvailability,
    resetRoomNameCheck,
  }
}
