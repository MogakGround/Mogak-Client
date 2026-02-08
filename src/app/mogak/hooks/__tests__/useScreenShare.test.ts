import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useScreenShare from '../useScreenShare'
import type { OpenVidu, Publisher, Session, Stream } from 'openvidu-browser'

// --- mocks ---

vi.mock('@/store/roomStore', () => ({
  useRoomStore: () => ({
    setScreenShareOn: vi.fn(),
  }),
}))

// --- helpers ---

function createMockPublisher(options?: { videoActive?: boolean }): Publisher {
  const mockTrack = {
    onended: null as (() => void) | null,
  }

  return {
    stream: {
      getMediaStream: () => ({
        getVideoTracks: () => [mockTrack],
      }),
      videoActive: options?.videoActive ?? true,
    } as unknown as Stream,
  } as unknown as Publisher
}

function createMockSession(options?: { publishError?: boolean }): ReturnType<OpenVidu['initSession']> {
  return {
    publish: vi.fn().mockImplementation(() => {
      if (options?.publishError) {
        return Promise.reject(new Error('Publish failed'))
      }
      return Promise.resolve()
    }),
    unpublish: vi.fn(),
  } as unknown as Session
}

function createMockOpenVidu(options?: { initError?: boolean }): OpenVidu {
  return {
    initPublisherAsync: vi.fn().mockImplementation(() => {
      if (options?.initError) {
        return Promise.reject(new Error('Init publisher failed'))
      }
      return Promise.resolve(createMockPublisher())
    }),
  } as unknown as OpenVidu
}

// --- tests ---

describe('useScreenShare', () => {
  let mockSession: ReturnType<typeof createMockSession>
  let mockOvRef: React.MutableRefObject<OpenVidu | null>
  let mockCleanupPublisher: ReturnType<typeof vi.fn<(target?: Publisher | null) => void>>

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    mockSession = createMockSession()
    mockOvRef = { current: createMockOpenVidu() }
    mockCleanupPublisher = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  describe('초기 상태', () => {
    it('초기에 화면공유가 비활성화 상태이다', () => {
      const { result } = renderHook(() =>
        useScreenShare({
          session: mockSession,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      expect(result.current.isScreenSharing).toBe(false)
      expect(result.current.publisher).toBeNull()
      expect(result.current.screenPublisher).toBeNull()
    })

    it('세션이 있으면 isSessionReady가 true이다', () => {
      const { result } = renderHook(() =>
        useScreenShare({
          session: mockSession,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      expect(result.current.isSessionReady).toBe(true)
    })

    it('세션이 없으면 isSessionReady가 false이다', () => {
      const { result } = renderHook(() =>
        useScreenShare({
          session: null,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      expect(result.current.isSessionReady).toBe(false)
    })
  })

  describe('화면공유 시작', () => {
    it('화면공유 시작 시 publisher가 생성되고 세션에 publish된다', async () => {
      const { result } = renderHook(() =>
        useScreenShare({
          session: mockSession,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      await act(async () => {
        await result.current.startScreenShare()
      })

      expect(mockOvRef.current?.initPublisherAsync).toHaveBeenCalledWith(undefined, {
        videoSource: 'screen',
        audioSource: false,
        publishAudio: false,
        publishVideo: true,
        mirror: false,
      })
      expect(mockSession.publish).toHaveBeenCalled()
      expect(result.current.isScreenSharing).toBe(true)
      expect(result.current.publisher).not.toBeNull()
    })

    it('세션이 없을 때 화면공유 시작 시 에러가 발생한다', async () => {
      const { result } = renderHook(() =>
        useScreenShare({
          session: null,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      await expect(
        act(async () => {
          await result.current.startScreenShare()
        }),
      ).rejects.toThrow('세션이 아직 연결되지 않았습니다.')
    })

    it('ovRef가 없을 때 화면공유 시작 시 에러가 발생한다', async () => {
      const { result } = renderHook(() =>
        useScreenShare({
          session: mockSession,
          ovRef: { current: null },
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      await expect(
        act(async () => {
          await result.current.startScreenShare()
        }),
      ).rejects.toThrow('세션이 아직 연결되지 않았습니다.')
    })

    it('이미 화면공유 중일 때 중복 시작을 방지한다', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const { result } = renderHook(() =>
        useScreenShare({
          session: mockSession,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      // 첫 번째 시작
      await act(async () => {
        await result.current.startScreenShare()
      })

      expect(mockOvRef.current?.initPublisherAsync).toHaveBeenCalledTimes(1)

      // 두 번째 시작 시도 (무시되어야 함)
      await act(async () => {
        await result.current.startScreenShare()
      })

      expect(mockOvRef.current?.initPublisherAsync).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith('이미 화면 공유 중이거나 시작 중입니다.')

      consoleSpy.mockRestore()
    })

    it('화면공유 시작 실패 시 cleanup 처리된다', async () => {
      mockOvRef.current = createMockOpenVidu({ initError: true })

      const { result } = renderHook(() =>
        useScreenShare({
          session: mockSession,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      await expect(
        act(async () => {
          await result.current.startScreenShare()
        }),
      ).rejects.toThrow('Init publisher failed')

      expect(result.current.isScreenSharing).toBe(false)
    })

    it('publish 실패 시 에러가 발생하고 화면공유 상태는 false이다', async () => {
      const failingSession = createMockSession({ publishError: true })

      const { result } = renderHook(() =>
        useScreenShare({
          session: failingSession,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      await expect(
        act(async () => {
          await result.current.startScreenShare()
        }),
      ).rejects.toThrow('Publish failed')

      // 에러 발생 후에도 화면공유 상태는 false로 유지되어야 함
      expect(result.current.isScreenSharing).toBe(false)
      expect(result.current.screenPublisher).toBeNull()
    })
  })

  describe('화면공유 중지', () => {
    it('화면공유 중지 시 publisher가 정리되고 세션에서 unpublish된다', async () => {
      const { result } = renderHook(() =>
        useScreenShare({
          session: mockSession,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      // 먼저 시작
      await act(async () => {
        await result.current.startScreenShare()
      })

      expect(result.current.isScreenSharing).toBe(true)

      // 중지
      act(() => {
        result.current.stopScreenShare()
      })

      expect(mockSession.unpublish).toHaveBeenCalled()
      expect(mockCleanupPublisher).toHaveBeenCalled()
      expect(result.current.isScreenSharing).toBe(false)
      expect(result.current.publisher).toBeNull()
    })

    it('화면공유 중이 아닐 때 중지해도 에러가 발생하지 않는다', () => {
      const { result } = renderHook(() =>
        useScreenShare({
          session: mockSession,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      expect(() => {
        act(() => {
          result.current.stopScreenShare()
        })
      }).not.toThrow()
    })
  })

  describe('OS 레벨 화면공유 중지 (track.onended)', () => {
    it('사용자가 OS에서 화면공유를 중지하면 stopScreenShare가 호출된다', async () => {
      let capturedOnended: (() => void) | null = null

      const mockPublisher = {
        stream: {
          getMediaStream: () => ({
            getVideoTracks: () => [
              {
                get onended() {
                  return capturedOnended
                },
                set onended(fn: (() => void) | null) {
                  capturedOnended = fn
                },
              },
            ],
          }),
          videoActive: true,
        },
      } as unknown as Publisher

      mockOvRef.current = {
        initPublisherAsync: vi.fn().mockResolvedValue(mockPublisher),
      } as unknown as OpenVidu

      const { result } = renderHook(() =>
        useScreenShare({
          session: mockSession,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      await act(async () => {
        await result.current.startScreenShare()
      })

      expect(result.current.isScreenSharing).toBe(true)
      expect(capturedOnended).not.toBeNull()

      // OS에서 화면공유 중지 시뮬레이션
      act(() => {
        capturedOnended?.()
      })

      await waitFor(() => {
        expect(result.current.isScreenSharing).toBe(false)
      })
    })
  })

  describe('시작→중지 시나리오', () => {
    it('화면공유 시작→중지→다시 시작이 정상 동작한다', async () => {
      const { result } = renderHook(() =>
        useScreenShare({
          session: mockSession,
          ovRef: mockOvRef,
          cleanupPublisher: mockCleanupPublisher,
        }),
      )

      // 첫 번째 시작
      await act(async () => {
        await result.current.startScreenShare()
      })
      expect(result.current.isScreenSharing).toBe(true)

      // 중지
      act(() => {
        result.current.stopScreenShare()
      })
      expect(result.current.isScreenSharing).toBe(false)

      // 다시 시작
      await act(async () => {
        await result.current.startScreenShare()
      })
      expect(result.current.isScreenSharing).toBe(true)
    })
  })
})
