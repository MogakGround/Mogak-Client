import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'

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
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const { clearTokens } = useAuthStore.getState()
      clearTokens()
      window.location.href = '/auth/signin'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
