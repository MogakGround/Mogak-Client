export interface GetCheckNicknameRequest {
  nickname: string
}

export interface GetMyProfileResponseData {
  nickName: string
  portfolioUrl: string
  rank: number
  hour: number
  min: number
  sec: number
}

export interface MyRankingResponseData {
  userId: number
  nickName: string
  rank: number
  hour: number
  min: number
  sec: number
}

export interface GetRankingListRequest {
  page: number
  size: number
}
export interface GetRankingListResponse {
  rankings: MyRankingResponseData[]
  totalPage: number
  currentPage: number
}
