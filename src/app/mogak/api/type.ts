export interface RoomResponse {
  roomId: number
  roomName: string
  roomExplain: string
  isLocked: boolean
  isHost: boolean
  userCnt: number
  roomImg: string
  workHours: string[]
}

export interface MyStatusResponse {
  nickName: string
  isScreenSharing: boolean
  isScreenAllowedLarge: boolean
  isTimerRunning: boolean
  hour: number
  min: number
  sec: number
}

export interface ScreenShareMembersResponse {
  users: number[]
  currentPage: number
  totalPages: number
}

export interface RoomMemberResponse {
  users: User[]
  userCnt: number
}

export interface TimerListResponse {
  code: number
  message: string
  data: {
    timers: Timer[]
    totalPage: number
    currentPage: number
  }
}
export interface User {
  userId: number
  nickName: string
}

export interface Timer {
  userId: number
  userNickName: string
  hour: number
  min: number
  sec: number
  isRunning: boolean
}
