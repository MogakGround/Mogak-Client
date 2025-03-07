import axiosInstance from '../axiosInstance'
import {
  PostAuthLoginRequest,
  PostAuthLoginResponseData,
  PostAuthSignUpRequest,
  PostAuthSignUpResponse,
} from './auth.types'

export const postAuthLogin = async (params: PostAuthLoginRequest) => {
  const { data } = await axiosInstance.post<PostAuthLoginResponseData>('/auth/login', params)
  return data
}

export const postAuthSignUp = async (params: PostAuthSignUpRequest) => {
  const { data } = await axiosInstance.post<PostAuthSignUpResponse>('/auth/signup', params)
  return data
}
