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
    console.log(res)

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
      console.error(res)
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
