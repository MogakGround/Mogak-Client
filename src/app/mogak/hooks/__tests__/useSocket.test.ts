import { renderHook, act, waitFor } from '@testing-library/react'
import { Server, WebSocket as MockWebSocket } from 'mock-socket'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import useSocket from '../useSocket'

// --- mocks ---

vi.mock('@/store/authStore', () => ({
  useAuthStore: {
    getState: () => ({ accessToken: 'test-token' }),
  },
}))

const SOCKET_URL = 'ws://localhost:8080'

beforeEach(() => {
  vi.stubEnv('NEXT_PUBLIC_SOCKET_URL', SOCKET_URL)
})

// --- helpers ---

function createServer() {
  const url = `${SOCKET_URL}?token=test-token&roomId=room-1`
  return new Server(url)
}

function sendToAllClients(server: Server, data: object) {
  const clients = server.clients()
  clients.forEach((client) => {
    client.send(JSON.stringify(data))
  })
}

// --- tests ---

describe('useSocket', () => {
  let server: Server

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.stubGlobal('WebSocket', MockWebSocket)
    server = createServer()
  })

  afterEach(() => {
    server.close()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  describe('연결 관리', () => {
    it('enabled=true일 때 연결하고 isConnected=true가 된다', async () => {
      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })
    })

    it('enabled=false일 때 연결하지 않는다', async () => {
      const { result } = renderHook(() => useSocket('room-1', false))

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500)
      })

      expect(result.current.isConnected).toBe(false)
    })

    it('enabled가 false→true로 변경되면 연결한다', async () => {
      const { result, rerender } = renderHook(({ enabled }) => useSocket('room-1', enabled), {
        initialProps: { enabled: false },
      })

      expect(result.current.isConnected).toBe(false)

      rerender({ enabled: true })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })
    })

    it('enabled가 true→false로 변경되면 연결을 끊는다', async () => {
      const { result, rerender } = renderHook(({ enabled }) => useSocket('room-1', enabled), {
        initialProps: { enabled: true },
      })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      rerender({ enabled: false })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false)
      })
    })

    it('언마운트 시 WebSocket을 정상 종료한다', async () => {
      const { result, unmount } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        unmount()
      })

      await waitFor(() => {
        expect(server.clients()).toHaveLength(0)
      })
    })
  })

  describe('메시지 수신', () => {
    it('서버 메시지를 수신하면 onMessage 콜백이 호출된다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'test', payload: 'hello' })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith(expect.objectContaining({ type: 'test', payload: 'hello' }))
      })
    })

    it('timer-start 이벤트를 올바르게 수신한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'timer-start', userId: 4 })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'timer-start', userId: 4 })
      })
    })

    it('timer-stop 이벤트를 올바르게 수신한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'timer-stop', userId: 4 })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'timer-stop', userId: 4 })
      })
    })

    it('screen-share-start 이벤트를 올바르게 수신한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'screen-share-start', userId: 5 })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'screen-share-start', userId: 5 })
      })
    })

    it('screen-share-stop 이벤트를 올바르게 수신한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'screen-share-stop', userId: 5 })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'screen-share-stop', userId: 5 })
      })
    })

    it('여러 메시지를 연속으로 수신할 수 있다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'timer-start', userId: 1 })
        sendToAllClients(server, { type: 'screen-share-start', userId: 2 })
        sendToAllClients(server, { type: 'timer-stop', userId: 1 })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledTimes(3)
        expect(onMessage).toHaveBeenNthCalledWith(1, { type: 'timer-start', userId: 1 })
        expect(onMessage).toHaveBeenNthCalledWith(2, { type: 'screen-share-start', userId: 2 })
        expect(onMessage).toHaveBeenNthCalledWith(3, { type: 'timer-stop', userId: 1 })
      })
    })

    it('onMessage 콜백이 변경되어도 최신 콜백이 호출된다', async () => {
      const onMessage1 = vi.fn()
      const onMessage2 = vi.fn()

      const { result, rerender } = renderHook(({ onMessage }) => useSocket('room-1', true, { onMessage }), {
        initialProps: { onMessage: onMessage1 },
      })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      rerender({ onMessage: onMessage2 })

      act(() => {
        sendToAllClients(server, { type: 'test' })
      })

      await waitFor(() => {
        expect(onMessage1).not.toHaveBeenCalled()
        expect(onMessage2).toHaveBeenCalledWith({ type: 'test' })
      })
    })
  })

  describe('메시지 전송', () => {
    it('sendStartScreenShare로 메시지를 전송한다', async () => {
      const receivedMessages: string[] = []

      server.on('connection', (socket) => {
        socket.on('message', (data) => {
          receivedMessages.push(data as string)
        })
      })

      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        result.current.sendStartScreenShare()
      })

      await waitFor(() => {
        expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'screen-share-start' }))
      })
    })

    it('sendStopScreenShare로 메시지를 전송한다', async () => {
      const receivedMessages: string[] = []

      server.on('connection', (socket) => {
        socket.on('message', (data) => {
          receivedMessages.push(data as string)
        })
      })

      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        result.current.sendStopScreenShare()
      })

      await waitFor(() => {
        expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'screen-share-stop' }))
      })
    })

    it('startTimer로 메시지를 전송한다', async () => {
      const receivedMessages: string[] = []

      server.on('connection', (socket) => {
        socket.on('message', (data) => {
          receivedMessages.push(data as string)
        })
      })

      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        result.current.startTimer()
      })

      await waitFor(() => {
        expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'timer-start' }))
      })
    })

    it('stopTimer로 메시지를 전송한다', async () => {
      const receivedMessages: string[] = []

      server.on('connection', (socket) => {
        socket.on('message', (data) => {
          receivedMessages.push(data as string)
        })
      })

      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        result.current.stopTimer()
      })

      await waitFor(() => {
        expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'timer-stop' }))
      })
    })

    it('연결 전에는 send 함수들이 아무 동작도 하지 않는다', () => {
      const { result } = renderHook(() => useSocket('room-1', false))

      expect(() => {
        act(() => {
          result.current.sendStartScreenShare()
          result.current.sendStopScreenShare()
          result.current.startTimer()
          result.current.stopTimer()
        })
      }).not.toThrow()
    })

    it('연결이 끊어진 상태에서 send 함수들이 에러 없이 동작한다', async () => {
      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 서버 연결 끊기
      act(() => {
        server.close()
      })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false)
      })

      // 끊어진 상태에서 전송 시도
      expect(() => {
        act(() => {
          result.current.sendStartScreenShare()
          result.current.stopTimer()
        })
      }).not.toThrow()
    })
  })

  describe('재연결 로직', () => {
    it('서버가 연결을 끊으면 재연결을 시도한다', async () => {
      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 서버가 연결을 끊음
      act(() => {
        server.close()
      })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false)
      })

      // 새 서버를 열어서 재연결 수용
      server = createServer()

      // 재연결 타이머 진행 (BASE_DELAY_MS = 1000)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })

      await waitFor(
        () => {
          expect(result.current.isConnected).toBe(true)
        },
        { timeout: 5000 },
      )
    })

    it('지수 백오프로 재연결을 시도한다', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 서버 종료 (재연결 불가 상태 유지)
      server.close()

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false)
      })

      // 첫 번째 재연결 시도 (1000ms 후)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000)
      })

      // 두 번째 재연결 시도 (2000ms 후)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000)
      })

      // 세 번째 재연결 시도 (4000ms 후)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(4000)
      })

      // 재연결 시도 로그 확인
      const reconnectLogs = consoleSpy.mock.calls.filter((call) => call[0]?.includes?.('재연결 시도'))

      expect(reconnectLogs.length).toBeGreaterThanOrEqual(3)

      consoleSpy.mockRestore()
    })

    it('최대 재연결 횟수 초과 시 재연결을 중단한다', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 서버 종료
      server.close()

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false)
      })

      // MAX_RECONNECT_ATTEMPTS = 10번 + 추가 시간
      // 지수 백오프: 1000, 2000, 4000, 8000, 16000, 30000(max), ...
      await act(async () => {
        await vi.advanceTimersByTimeAsync(300000) // 5분
      })

      // 최대 재연결 횟수 초과 로그 확인
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('최대 재연결 횟수 초과'))

      consoleErrorSpy.mockRestore()
    })

    it('의도적 종료(언마운트) 시 재연결을 시도하지 않는다', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const { result, unmount } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 의도적 종료
      act(() => {
        unmount()
      })

      // 시간 경과
      await act(async () => {
        await vi.advanceTimersByTimeAsync(5000)
      })

      // 재연결 시도 로그가 없어야 함
      const reconnectLogs = consoleSpy.mock.calls.filter((call) => call[0]?.includes?.('재연결 시도'))

      expect(reconnectLogs.length).toBe(0)

      consoleSpy.mockRestore()
    })
  })

  describe('통합 시나리오', () => {
    it('화면공유 시작→타이머 시작→화면공유 중지→타이머 중지 시나리오', async () => {
      const onMessage = vi.fn()
      const receivedMessages: string[] = []

      server.on('connection', (socket) => {
        socket.on('message', (data) => {
          receivedMessages.push(data as string)
        })
      })

      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 사용자 액션: 화면공유 시작
      act(() => {
        result.current.sendStartScreenShare()
      })

      // 서버 응답: 다른 사용자의 화면공유 시작 알림
      act(() => {
        sendToAllClients(server, { type: 'screen-share-start', userId: 4 })
      })

      // 사용자 액션: 타이머 시작
      act(() => {
        result.current.startTimer()
      })

      // 서버 응답: 타이머 시작 알림
      act(() => {
        sendToAllClients(server, { type: 'timer-start', userId: 4 })
      })

      // 사용자 액션: 화면공유 중지
      act(() => {
        result.current.sendStopScreenShare()
      })

      // 서버 응답: 화면공유 중지 알림
      act(() => {
        sendToAllClients(server, { type: 'screen-share-stop', userId: 4 })
      })

      // 사용자 액션: 타이머 중지
      act(() => {
        result.current.stopTimer()
      })

      // 서버 응답: 타이머 중지 알림
      act(() => {
        sendToAllClients(server, { type: 'timer-stop', userId: 4 })
      })

      await waitFor(() => {
        // 전송된 메시지 확인
        expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'screen-share-start' }))
        expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'timer-start' }))
        expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'screen-share-stop' }))
        expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'timer-stop' }))

        // 수신된 메시지 확인
        expect(onMessage).toHaveBeenCalledWith({ type: 'screen-share-start', userId: 4 })
        expect(onMessage).toHaveBeenCalledWith({ type: 'timer-start', userId: 4 })
        expect(onMessage).toHaveBeenCalledWith({ type: 'screen-share-stop', userId: 4 })
        expect(onMessage).toHaveBeenCalledWith({ type: 'timer-stop', userId: 4 })
      })
    })

    it('재연결 후에도 메시지 송수신이 정상 동작한다', async () => {
      const onMessage = vi.fn()
      const receivedMessages: string[] = []

      server.on('connection', (socket) => {
        socket.on('message', (data) => {
          receivedMessages.push(data as string)
        })
      })

      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 첫 번째 메시지 전송
      act(() => {
        result.current.startTimer()
      })

      // 연결 끊김
      act(() => {
        server.close()
      })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false)
      })

      // 새 서버로 재연결
      server = createServer()
      server.on('connection', (socket) => {
        socket.on('message', (data) => {
          receivedMessages.push(data as string)
        })
      })

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 재연결 후 메시지 전송
      act(() => {
        result.current.stopTimer()
      })

      // 재연결 후 메시지 수신
      act(() => {
        sendToAllClients(server, { type: 'test-after-reconnect' })
      })

      await waitFor(() => {
        expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'timer-stop' }))
        expect(onMessage).toHaveBeenCalledWith({ type: 'test-after-reconnect' })
      })
    })
  })
})
