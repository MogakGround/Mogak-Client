export interface PostAuthLoginRequest {
  kakaoCode: string
}

interface PostAuthLoginResponseData {
  userId: number
  isNewUser: boolean
  accessToken: string
  refreshToken: string
}
export interface PostAuthLoginResponse {
  code: number
  message: string
  data: PostAuthLoginResponseData
}

export interface PostAuthSignUpRequest {
  kakaoCode: string
  nickName: string
  portfolioUrl: string
}
export interface PostAuthSignUpResponse {
  userId: number
  accessToken: string
  refreshToken: string
}
