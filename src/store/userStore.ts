import { getMyProfile } from '@/app/api/user/api'
import { create } from 'zustand'

interface UserStore {
  nickname: string | null
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

export const useUserStore = create<UserStore>((set) => ({
  nickname: null,
  portfolioUrl: null,
  rank: null,
  time: {
    hour: null,
    min: null,
    sec: null,
  },

  fetchUser: async () => {
    const res = await getMyProfile()

    if (res.code === 200) {
      set({
        nickname: res.data.nickName,
        portfolioUrl: res.data.portfolioUrl,
        rank: res.data.rank,
        time: {
          hour: res.data.hour,
          min: res.data.min,
          sec: res.data.sec,
        },
      })
    } else {
      console.error(res.message)
    }
  },
  clearUser: () => {
    set({
      nickname: null,
      portfolioUrl: null,
      rank: null,
      time: {
        hour: null,
        min: null,
        sec: null,
      },
    })
  },
}))
