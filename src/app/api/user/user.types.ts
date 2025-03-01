export interface getCheckNicknameRequest {
  nickname: string
}
export interface getCheckNicknameResponse {
  code: number
  message: string
}

interface getMyProfileResponseData {
  nickName: string
  portfolioUrl: string
  rank: number
  hour: number
  min: number
  sec: number
}
export interface getMyProfileResponse {
  code: number
  message: string
  data: getMyProfileResponseData
}
