import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'
import { ErrorResponse } from './api.types'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState()

    config.headers = config.headers || {}
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config as InternalAxiosRequestConfig
  },
  (error: AxiosError) => {
    console.error(error)
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    if (!error.response) {
      alert('네트워크 오류가 발생했습니다. 다시 시도해 주세요.')
      throw new ErrorResponse(0, 0, 'Network Error')
    }

    const { status, data } = error.response
    const message = (data as { message?: string })?.message || 'An error occurred'
    const code = (data as { code?: number })?.code || 0

    const errorResponse = new ErrorResponse(status, code, message)

    if (status === 401) {
      const { clearTokens } = useAuthStore.getState()
      clearTokens()
      window.location.href = '/auth/signin'
      throw errorResponse
    }
    if (status === 500) {
      alert('서버에서 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
      throw errorResponse
    }

    throw errorResponse
  }
)

export default axiosInstance
