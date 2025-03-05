import axiosInstance from '../axiosInstance'
import { getCheckNicknameRequest, getCheckNicknameResponse, getMyProfileResponse } from './user.types'

export const getCheckNickname = async (body: getCheckNicknameRequest) => {
  const { data } = await axiosInstance.get<getCheckNicknameResponse>('check-nickname', {
    params: body,
  })

  return data
}

export const getMyProfile = async () => {
  const { data } = await axiosInstance.get<getMyProfileResponse>('/mypage')

  return data
}
