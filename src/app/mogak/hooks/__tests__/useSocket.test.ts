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

// --- tests ---

describe('useSocket', () => {
  let server: Server

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    // mock-socket이 전역 WebSocket을 대체
    vi.stubGlobal('WebSocket', MockWebSocket)
    server = createServer()
  })

  afterEach(() => {
    server.close()
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('enabled=true일 때 연결하고 isConnected=true가 된다', async () => {
    const { result } = renderHook(() => useSocket('room-1', true))

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true)
    })
  })

  it('enabled=false일 때 연결하지 않는다', async () => {
    const { result } = renderHook(() => useSocket('room-1', false))

    // 약간 대기 후에도 연결되지 않아야 함
    await act(async () => {
      await vi.advanceTimersByTimeAsync(500)
    })

    expect(result.current.isConnected).toBe(false)
  })

  it('서버 메시지를 수신하면 onMessage 콜백이 호출된다', async () => {
    const onMessage = vi.fn()

    const { result } = renderHook(() => useSocket('room-1', true, { onMessage }))

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true)
    })

    act(() => {
      server.emit('message', JSON.stringify({ type: 'test', payload: 'hello' }))
    })

    // mock-socket은 server.emit('message')가 아닌 server.clients()를 통해 전송
    // 직접 클라이언트에 send
    const clients = server.clients()
    if (clients.length > 0) {
      clients[0].send(JSON.stringify({ type: 'test', payload: 'hello' }))
    }

    await waitFor(() => {
      expect(onMessage).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'test', payload: 'hello' }),
      )
    })
  })

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
      expect(receivedMessages).toContainEqual(
        JSON.stringify({ type: 'screen-share-start' }),
      )
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
      expect(receivedMessages).toContainEqual(
        JSON.stringify({ type: 'screen-share-stop' }),
      )
    })
  })

  it('startTimer / stopTimer로 타이머 메시지를 전송한다', async () => {
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

    act(() => {
      result.current.stopTimer()
    })

    await waitFor(() => {
      expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'timer-start' }))
      expect(receivedMessages).toContainEqual(JSON.stringify({ type: 'timer-stop' }))
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

    // 언마운트 후 서버 클라이언트가 없어야 함
    await waitFor(() => {
      expect(server.clients()).toHaveLength(0)
    })
  })

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

  it('연결 전에는 send 함수들이 아무 동작도 하지 않는다', () => {
    const { result } = renderHook(() => useSocket('room-1', false))

    // 연결되지 않은 상태에서 호출해도 에러 없이 동작
    expect(() => {
      act(() => {
        result.current.sendStartScreenShare()
        result.current.sendStopScreenShare()
        result.current.startTimer()
        result.current.stopTimer()
      })
    }).not.toThrow()
  })
})
