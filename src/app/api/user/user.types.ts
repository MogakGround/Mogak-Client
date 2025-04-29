export interface getCheckNicknameRequest {
  nickname: string
}

export interface getMyProfileResponseData {
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

export interface getRankingListRequest {
  page: number
  size: number
}
export interface getRankingListResponse {
  rankings: MyRankingResponseData[]
  totalPage: number
  currentPage: number
}
