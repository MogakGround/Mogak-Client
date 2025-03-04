export interface PostAuthLoginRequest {
  kakaoCode: string
}

export interface PostAuthLoginResponseData {
  kakaoId?: number
  status: 'success' | 'fail'
  accessToken: string
  refreshToken: string
}

export interface PostAuthSignUpRequest {
  kakaoId: string
  nickName: string
  portfolioUrl: string
}

export interface PostAuthSignUpResponse {
  accessToken: string
  refreshToken: string
}
