export interface PostAuthLoginRequest {
  kakaoCode: string
}

interface PostAuthLoginResponseData {
  kakaoId?: number
  status: 'success' | 'fail'
  accessToken: string
  refreshToken: string
}
export interface PostAuthLoginResponse {
  code: number
  message: string
  data: PostAuthLoginResponseData
}

export interface PostAuthSignUpRequest {
  kakaoId: string
  nickName: string
  portfolioUrl: string
}
export interface PostAuthSignUpResponse {
  userId: number
  accessToken: string
  refreshToken: string
}
