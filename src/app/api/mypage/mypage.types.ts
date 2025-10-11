import { RoomImg, WorkHours } from '../room/room.types'

export interface PatchProfileRequest {
  nickName: string
  portfolioUrl: string
}

export interface GetProfileResponseData {
  nickName: string
  portfolioUrl: string
  rank: number
  hour: number
  min: number
  sec: number
}

export interface GetRankResponseData {
  userId: number
  nickName: string
  rank: number
  hour: number
  min: number
  sec: number
}

export interface MyRoom {
  roomId: number
  roomName: string
  roomImgUrl: RoomImg
  roomExplain?: string
  workHours: WorkHours[]
  isLocked: boolean
  userCnt: number
  roomPassword?: string
  hour: number
  min: number
  sec: number
}

// 모각방 리스트 조회
export interface GetRoomsRequest {
  page: number
  size: number
}
export interface GetRoomsResponseData {
  totalPage: number
  currentPage: number
  rooms: MyRoom[]
}
