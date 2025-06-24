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
            set({
              nickname: res.nickName,
              portfolioUrl: res.portfolioUrl,
              rank: res.rank,
              time: {
                hour: res.hour,
                min: res.min,
                sec: res.sec,
              },
            })
          } else {
            console.error('Failed to fetch user profile')
          }
        } catch (error) {
          console.error('Error fetching user profile:', error)
        }
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
