import axiosInstance from '../axiosInstance'
import { getCheckNicknameRequest, getCheckNicknameResponse } from './user.types'

export const getCheckNickname = async (body: getCheckNicknameRequest) => {
  const { data } = await axiosInstance.get<getCheckNicknameResponse>('check-nickname', {
    params: body,
  })

  return data
}
