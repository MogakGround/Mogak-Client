import axiosInstance from '../axiosInstance'
import { getCheckNicknameRequest, getMyProfileResponseData } from './user.types'

export const getCheckNickname = async (body: getCheckNicknameRequest) => {
  return await axiosInstance.get('check-nickname', {
    params: body,
  })
}

export const getMyProfile = async () => {
  const { data } = await axiosInstance.get<getMyProfileResponseData>('/mypage')

  return data
}
