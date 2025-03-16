export type WorkHours = 'LATE_NIGHT' | 'MORNING' | 'AFTERNOON' | 'NIGHT'

export interface PostRoomRequest {
  roomName: string
  roomExplain: string
  roomImg: string
  workHours: WorkHours[]
  isLocked: boolean
  roomPassword: string
}
