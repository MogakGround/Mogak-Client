import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'
import { ErrorResponse } from './api.types'
import { postRefreshToken } from './auth/api'
import { useUserStore } from '@/store/userStore'

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    if (!error.response) {
      throw new ErrorResponse(0, 0, 'Network Error')
    }

    const { status, data } = error.response
    const message = (data as { message?: string })?.message || 'An error occurred'
    const code = (data as { code?: number })?.code || 0

    const errorResponse = new ErrorResponse(status, code, message)

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const { accessToken, setAccessToken, clearTokens } = useAuthStore.getState()

      const { clearUser } = useUserStore.getState()

      if (accessToken) {
        try {
          const { accessToken: newAccessToken } = await postRefreshToken()
          setAccessToken(newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

          return axiosInstance(originalRequest)
        } catch (refreshError) {
          clearTokens()
          clearUser();
          window.location.href = '/auth/signin'
          console.error(refreshError)
          throw errorResponse
        }
      } else {
        clearTokens()
        clearUser()
        window.location.href = '/auth/signin'
        throw errorResponse
      }
    }

    throw errorResponse
  }
)

export default axiosInstance
