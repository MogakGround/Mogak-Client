import { create } from 'zustand'
import { deleteCookie, getCookie, setCookie } from 'cookies-next'
import { useUserStore } from './userStore'

interface AuthStore {
  accessToken: string | null
  setAccessToken: (accessToken: string) => void
  clearTokens: () => void
}

export const useAuthStore = create<AuthStore>()((set) => ({
  accessToken: getCookie('accessToken') as string | null,

  setAccessToken: (accessToken: string) => {
    setCookie('accessToken', accessToken, {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
    })
    set({ accessToken })
  },
  clearTokens: () => {
    deleteCookie('accessToken')
    set({ accessToken: null })
    useUserStore.getState().clearUser()
  },
}))
