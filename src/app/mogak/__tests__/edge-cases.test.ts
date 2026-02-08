import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Server, WebSocket as MockWebSocket } from 'mock-socket'
import useSocket from '../hooks/useSocket'

// --- mocks ---

vi.mock('@/store/authStore', () => ({
  useAuthStore: {
    getState: () => ({ accessToken: 'test-token' }),
  },
}))

vi.mock('@/hooks/useLatestRef', () => ({
  useLatestRef: <T,>(value: T) => ({ current: value }),
}))

const SOCKET_URL = 'ws://localhost:8080'

// --- helpers ---

function createServer() {
  const url = `${SOCKET_URL}?token=test-token&roomId=room-1`
  return new Server(url)
}

function sendToAllClients(server: Server, data: object | string) {
  const clients = server.clients()
  clients.forEach((client) => {
    if (typeof data === 'string') {
      client.send(data)
    } else {
      client.send(JSON.stringify(data))
    }
  })
}

// --- tests ---

describe('Edge Cases', () => {
  let server: Server

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.stubEnv('NEXT_PUBLIC_SOCKET_URL', SOCKET_URL)
    vi.stubGlobal('WebSocket', MockWebSocket)
    server = createServer()
  })

  afterEach(() => {
    server.close()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  describe('잘못된 형식의 WebSocket 메시지', () => {
    it('JSON이 아닌 메시지를 받으면 JSON.parse 에러가 발생한다', async () => {
      const onMessage = vi.fn()

      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 잘못된 JSON 전송 - JSON.parse에서 SyntaxError 발생
      expect(() => {
        act(() => {
          sendToAllClients(server, 'not a json string')
        })
      }).toThrow(SyntaxError)

      // 에러 발생 후에도 연결은 유지됨
      expect(result.current.isConnected).toBe(true)

      // onMessage는 호출되지 않음
      expect(onMessage).not.toHaveBeenCalled()
    })

    it('빈 객체 메시지를 처리한다', async () => {
      const onMessage = vi.fn()

      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, {})
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({})
      })
    })

    it('type이 없는 메시지를 처리한다', async () => {
      const onMessage = vi.fn()

      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { userId: 1, data: 'test' })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ userId: 1, data: 'test' })
      })
    })

    it('userId가 문자열인 메시지를 처리한다', async () => {
      const onMessage = vi.fn()

      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'timer-start', userId: '123' })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'timer-start', userId: '123' })
      })
    })
  })

  describe('동시에 여러 사용자 이벤트', () => {
    it('동시에 여러 timer-start 이벤트를 처리한다', async () => {
      const onMessage = vi.fn()

      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'timer-start', userId: 1 })
        sendToAllClients(server, { type: 'timer-start', userId: 2 })
        sendToAllClients(server, { type: 'timer-start', userId: 3 })
        sendToAllClients(server, { type: 'timer-start', userId: 4 })
        sendToAllClients(server, { type: 'timer-start', userId: 5 })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledTimes(5)
      })

      expect(onMessage).toHaveBeenNthCalledWith(1, { type: 'timer-start', userId: 1 })
      expect(onMessage).toHaveBeenNthCalledWith(2, { type: 'timer-start', userId: 2 })
      expect(onMessage).toHaveBeenNthCalledWith(3, { type: 'timer-start', userId: 3 })
      expect(onMessage).toHaveBeenNthCalledWith(4, { type: 'timer-start', userId: 4 })
      expect(onMessage).toHaveBeenNthCalledWith(5, { type: 'timer-start', userId: 5 })
    })

    it('혼합된 이벤트 타입을 올바른 순서로 처리한다', async () => {
      const onMessage = vi.fn()

      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'timer-start', userId: 1 })
        sendToAllClients(server, { type: 'screen-share-start', userId: 2 })
        sendToAllClients(server, { type: 'timer-stop', userId: 1 })
        sendToAllClients(server, { type: 'screen-share-stop', userId: 2 })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledTimes(4)
      })

      expect(onMessage).toHaveBeenNthCalledWith(1, { type: 'timer-start', userId: 1 })
      expect(onMessage).toHaveBeenNthCalledWith(2, { type: 'screen-share-start', userId: 2 })
      expect(onMessage).toHaveBeenNthCalledWith(3, { type: 'timer-stop', userId: 1 })
      expect(onMessage).toHaveBeenNthCalledWith(4, { type: 'screen-share-stop', userId: 2 })
    })
  })

  describe('빠른 연속 토글', () => {
    it('빠른 연속 타이머 시작/중지가 에러 없이 처리된다', async () => {
      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 빠른 연속 호출
      expect(() => {
        act(() => {
          result.current.startTimer()
          result.current.stopTimer()
          result.current.startTimer()
          result.current.stopTimer()
          result.current.startTimer()
        })
      }).not.toThrow()
    })
  })

  describe('재연결 시 상태', () => {
    it('재연결 후에도 onMessage 콜백이 정상 동작한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 첫 번째 메시지 수신
      act(() => {
        sendToAllClients(server, { type: 'test-1' })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'test-1' })
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

      await act(async () => {
        await vi.advanceTimersByTimeAsync(1500)
      })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 재연결 후 메시지 수신
      act(() => {
        sendToAllClients(server, { type: 'test-2' })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'test-2' })
      })
    })

    it('재연결 중에 전송 시도해도 에러가 발생하지 않는다', async () => {
      const { result } = renderHook(() => useSocket('room-1', true))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      // 연결 끊김
      act(() => {
        server.close()
      })

      await waitFor(() => {
        expect(result.current.isConnected).toBe(false)
      })

      // 재연결 중 전송 시도 (에러 없어야 함)
      expect(() => {
        act(() => {
          result.current.startTimer()
          result.current.stopTimer()
        })
      }).not.toThrow()
    })
  })

  describe('대량 메시지 처리', () => {
    it('100개의 연속 메시지를 처리한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        for (let i = 0; i < 100; i++) {
          sendToAllClients(server, { type: 'test', index: i })
        }
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledTimes(100)
      })

      // 순서 확인
      expect(onMessage).toHaveBeenNthCalledWith(1, { type: 'test', index: 0 })
      expect(onMessage).toHaveBeenNthCalledWith(100, { type: 'test', index: 99 })
    })
  })

  describe('특수 데이터 타입', () => {
    it('null 값을 포함한 메시지를 처리한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'test', userId: null })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'test', userId: null })
      })
    })

    it('배열을 포함한 메시지를 처리한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'test', users: [1, 2, 3] })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'test', users: [1, 2, 3] })
      })
    })

    it('중첩 객체를 포함한 메시지를 처리한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, {
          type: 'test',
          data: {
            user: { id: 1, name: 'test' },
            meta: { timestamp: 123456 },
          },
        })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({
          type: 'test',
          data: {
            user: { id: 1, name: 'test' },
            meta: { timestamp: 123456 },
          },
        })
      })
    })
  })

  describe('경계 조건', () => {
    it('userId가 0인 이벤트를 처리한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'timer-start', userId: 0 })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'timer-start', userId: 0 })
      })
    })

    it('userId가 음수인 이벤트를 처리한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'timer-start', userId: -1 })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'timer-start', userId: -1 })
      })
    })

    it('userId가 매우 큰 숫자인 이벤트를 처리한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: 'timer-start', userId: Number.MAX_SAFE_INTEGER })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: 'timer-start', userId: Number.MAX_SAFE_INTEGER })
      })
    })

    it('빈 type 문자열을 처리한다', async () => {
      const onMessage = vi.fn()
      const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

      await waitFor(() => {
        expect(result.current.isConnected).toBe(true)
      })

      act(() => {
        sendToAllClients(server, { type: '', userId: 1 })
      })

      await waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith({ type: '', userId: 1 })
      })
    })
  })
})
