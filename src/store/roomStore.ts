import { create } from 'zustand'

interface RoomState {
  screenShareOn: boolean
  setScreenShareOn: (screenShareOn: boolean) => void
}

export const useRoomStore = create<RoomState>((set) => ({
  screenShareOn: false,
  setScreenShareOn: (screenShareOn) => set({ screenShareOn }),
}))
