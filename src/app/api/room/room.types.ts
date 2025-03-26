export type WorkHours = 'LATE_NIGHT' | 'MORNING' | 'AFTERNOON' | 'NIGHT'
export type RoomImg = 'NULL_NULL' | 'NO_EO' | 'SHIT_GRASS' | 'WHY_PIG'

export interface PostCreateRoomRequest {
  roomName: string
  roomExplain?: string
  roomImg: RoomImg
  workHours: WorkHours[]
  isLocked: boolean
  roomPassword?: string
}

export interface GetCheckRoomNameReqeust {
  roomName: string
}
