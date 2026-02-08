import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useRoomEntry from '../useRoomEntry'

// --- mocks ---

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

const mockPostEnterRoom = vi.fn()

vi.mock('@/app/api/home/api', () => ({
  postEnterRoom: (...args: unknown[]) => mockPostEnterRoom(...args),
}))

// --- tests ---

describe('useRoomEntry', () => {
  let mockSessionStorage: Record<string, string>

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    mockPostEnterRoom.mockClear()
    mockReplace.mockClear()

    // sessionStorage mock
    mockSessionStorage = {}
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => mockSessionStorage[key] ?? null,
      setItem: (key: string, value: string) => {
        mockSessionStorage[key] = value
      },
      removeItem: (key: string) => {
        delete mockSessionStorage[key]
      },
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  describe('방 입장 성공', () => {
    it('방 입장 API 호출 성공 시 isRoomEntered가 true가 된다', async () => {
      mockPostEnterRoom.mockResolvedValue({ success: true })

      const { result } = renderHook(() => useRoomEntry('room-1'))

      expect(result.current).toBe(false)

      await waitFor(() => {
        expect(result.current).toBe(true)
      })

      expect(mockPostEnterRoom).toHaveBeenCalledWith(NaN, {
        // Number('room-1') = NaN
        isScreenShared: false,
        isVideoLargeAllowed: false,
      })
    })

    it('숫자 roomId로 API를 호출한다', async () => {
      mockPostEnterRoom.mockResolvedValue({ success: true })

      renderHook(() => useRoomEntry('123'))

      await waitFor(() => {
        expect(mockPostEnterRoom).toHaveBeenCalledWith(123, {
          isScreenShared: false,
          isVideoLargeAllowed: false,
        })
      })
    })
  })

  describe('방 입장 실패', () => {
    it('방 입장 API 호출 실패 시 홈으로 리다이렉트된다', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      mockPostEnterRoom.mockRejectedValue(new Error('입장 실패'))

      const { result } = renderHook(() => useRoomEntry('123'))

      await waitFor(() => {
        expect(mockReplace).toHaveBeenCalledWith('/')
      })

      expect(result.current).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('방 입장 실패:', expect.any(Error))

      consoleErrorSpy.mockRestore()
    })
  })

  describe('sessionStorage 캐시', () => {
    it('sessionStorage에 enteredRoom이 있으면 즉시 true가 된다', async () => {
      mockSessionStorage['enteredRoom'] = 'room-1'

      const { result } = renderHook(() => useRoomEntry('room-1'))

      await waitFor(() => {
        expect(result.current).toBe(true)
      })

      // sessionStorage에서 즉시 true가 되므로 API 호출이 스킵됨
      expect(mockSessionStorage['enteredRoom']).toBeUndefined()
    })

    it('sessionStorage에 다른 방 ID가 있으면 API를 호출한다', async () => {
      mockSessionStorage['enteredRoom'] = 'room-2'
      mockPostEnterRoom.mockResolvedValue({ success: true })

      const { result } = renderHook(() => useRoomEntry('room-1'))

      await waitFor(() => {
        expect(result.current).toBe(true)
      })

      expect(mockPostEnterRoom).toHaveBeenCalled()
    })

    it('sessionStorage의 enteredRoom이 제거된다', async () => {
      mockSessionStorage['enteredRoom'] = 'room-1'

      renderHook(() => useRoomEntry('room-1'))

      await waitFor(() => {
        expect(mockSessionStorage['enteredRoom']).toBeUndefined()
      })
    })
  })

  describe('roomId 변경', () => {
    it('roomId가 변경되면 새로운 방 입장을 시도한다', async () => {
      mockPostEnterRoom.mockResolvedValue({ success: true })

      const { result, rerender } = renderHook(({ roomId }) => useRoomEntry(roomId), {
        initialProps: { roomId: '123' },
      })

      await waitFor(() => {
        expect(result.current).toBe(true)
      })

      // roomId 변경
      rerender({ roomId: '456' })

      await waitFor(() => {
        // 새 roomId로 API가 호출되었는지 확인
        expect(mockPostEnterRoom).toHaveBeenCalledWith(456, {
          isScreenShared: false,
          isVideoLargeAllowed: false,
        })
      })
    })
  })
})
