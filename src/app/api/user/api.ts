import axiosInstance from '../axiosInstance'
import {
  GetCheckNicknameRequest,
  GetMyProfileResponseData,
  MyRankingResponseData,
  GetRankingListRequest,
  GetRankingListResponse,
} from './user.types'

export const getCheckNickname = async (body: GetCheckNicknameRequest) => {
  return await axiosInstance.get('check-nickname', {
    params: body,
  })
}

export const getMyProfile = async () => {
  const { data } = await axiosInstance.get<GetMyProfileResponseData>('/mypage')

  return data
}

export const getMyRanking = async () => {
  const { data } = await axiosInstance.get<MyRankingResponseData>('/my/ranking')

  return data
}

export const getRankingList = async (body: GetRankingListRequest) => {
  const { data } = await axiosInstance.get<GetRankingListResponse>('/rankings', {
    params: body,
  })

  return data
}
