import { RoomImg, WorkHours } from '../room/room.types'

interface Room {
  roomId: number
  roomName: string
  roomExplain?: string
  isLocked: boolean
  isHost: boolean
  userCnt: number
  roomImg: RoomImg
  workHours: WorkHours[]
}

// 모각작 방 조회
export interface GetRoomsRequest {
  page: number
  size: number
  workHours: WorkHours[]
}

export interface GetRoomsResponseData {
  rooms: Room[]
  totalPages: number
  currentPage: number
  totalRooms: number
}
