export interface PostAuthLoginRequest {
  kakaoCode: string
}

export interface PostAuthLoginResponseData {
  kakaoId?: number
  status: 'success' | 'fail'
  accessToken: string
}

export interface PostAuthSignUpRequest {
  kakaoId: string
  nickName: string
  portfolioUrl: string
}

export interface PostAuthSignUpResponse {
  accessToken: string
}

export interface PostAuthRefreshTokenResponse extends PostAuthLoginResponseData {}
