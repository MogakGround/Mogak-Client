import { User } from '@/app/mogak/api/type'
import { create } from 'zustand'

interface RoomState {
  members: User[]
  setMembers: (members: User[]) => void
  addMember: (member: User) => void
  removeMember: (userId: number) => void
  screenShareOn: boolean
  setScreenShareOn: (screenShareOn: boolean) => void
}

export const useRoomStore = create<RoomState>((set) => ({
  members: [],
  setMembers: (members) => {
    set({ members })
  },
  addMember: (member) =>
    set((state) => {
      const alreadyExists = state.members.some((m) => m.userId === member.userId)
      if (alreadyExists) {
        return state
      }
      console.log('유저 추가')
      return {
        members: [...state.members, member],
      }
    }),
  removeMember: (userId) =>
    set((state) => ({
      members: state.members.filter((m) => m.userId !== userId),
    })),
  screenShareOn: false,
  setScreenShareOn: (screenShareOn) => set({ screenShareOn }),
}))
