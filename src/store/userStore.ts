import { getMyProfile } from '@/app/api/user/api'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserStore {
  nickname: string | null
  userID: string | null
  portfolioUrl: string | null
  rank: number | null
  time: {
    hour: number | null
    min: number | null
    sec: number | null
  }
  fetchUser: () => Promise<void>
  clearUser: () => void
  setUser: (userData: {
    nickname: string
    userID?: string
    portfolioUrl?: string
    rank?: number
    time?: { hour: number; min: number; sec: number }
  }) => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      nickname: null,
      userID: null,
      portfolioUrl: null,
      rank: null,
      time: {
        hour: null,
        min: null,
        sec: null,
      },

      fetchUser: async () => {
        try {
          const res = await getMyProfile()

          if (res) {
            const userData = {
              nickname: res.nickName,
              portfolioUrl: res.portfolioUrl,
              rank: res.rank,
              time: {
                hour: res.hour,
                min: res.min,
                sec: res.sec,
              },
            }

            set(userData)
          } else {
            console.error('Failed to fetch user profile')
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
      },

      setUser: (userData) => {
        set({
          nickname: userData.nickname,
          userID: userData.userID || null,
          portfolioUrl: userData.portfolioUrl || null,
          rank: userData.rank || null,
          time: userData.time || {
            hour: null,
            min: null,
            sec: null,
          },
        })
      },

      clearUser: () => {
        set({
          nickname: null,
          userID: null,
          portfolioUrl: null,
          rank: null,
          time: {
            hour: null,
            min: null,
            sec: null,
          },
        })
      },
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        nickname: state.nickname,
        userID: state.userID,
        portfolioUrl: state.portfolioUrl,
        rank: state.rank,
        time: state.time,
      }),
    }
  )
)
