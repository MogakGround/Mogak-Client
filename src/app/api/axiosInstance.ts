import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'
import { ErrorResponse } from './api.types'
import { postRefreshToken } from './auth/api'

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined

    if (!error.response) {
      throw new ErrorResponse(0, 0, 'Network Error')
    }

    const { status, data } = error.response
    const message = (data as { message?: string })?.message || 'An error occurred'
    const code = (data as { code?: number })?.code || 0

    const errorResponse = new ErrorResponse(status, code, message)

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true

      const { accessToken, setAccessToken } = useAuthStore.getState()

      if (accessToken) {
        try {
          const { accessToken: newAccessToken } = await postRefreshToken()
          setAccessToken(newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          return axiosInstance(originalRequest)
        } catch (refreshError) {
          useAuthStore.getState().clearTokens()

          if (typeof window !== 'undefined') {
            window.location.href = '/auth/signin'
          }

          throw errorResponse
        }
      }
    }

    throw errorResponse
  }
)

export default axiosInstance
