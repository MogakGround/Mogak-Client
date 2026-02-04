'use client'

import { useAuthStore } from '@/store/authStore'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function useSocket(roomId: string, enabled: boolean = true) {
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reconnectAttemptRef = useRef(0)
  const intentionalCloseRef = useRef(false)

  const MAX_RECONNECT_ATTEMPTS = 10
  const BASE_DELAY_MS = 1000

  const { accessToken } = useAuthStore.getState()

  const handleMessage = useCallback((event: MessageEvent) => {
    const data = JSON.parse(event.data)
    console.log('📩 서버 메시지:', data)
  }, [])

  useEffect(() => {
    if (!enabled) return

    const connect = () => {
      const wsUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}?token=${accessToken}&roomId=${roomId}`
      console.log('🔌 WebSocket 연결 시도:', wsUrl)

      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        console.log('✅ WebSocket 연결 성공')
        setIsConnected(true)
        reconnectAttemptRef.current = 0
      }

      ws.onmessage = handleMessage

      ws.onclose = (event) => {
        console.log('❌ WebSocket 연결 종료:', { code: event.code, reason: event.reason })
        setIsConnected(false)
        wsRef.current = null

        if (!intentionalCloseRef.current && reconnectAttemptRef.current < MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(BASE_DELAY_MS * Math.pow(2, reconnectAttemptRef.current), 30000)
          console.log(`🔄 ${delay}ms 후 재연결 시도 (${reconnectAttemptRef.current + 1}/${MAX_RECONNECT_ATTEMPTS})`)
          reconnectTimerRef.current = setTimeout(() => {
            reconnectAttemptRef.current += 1
            connect()
          }, delay)
        } else if (reconnectAttemptRef.current >= MAX_RECONNECT_ATTEMPTS) {
          console.error('🚫 최대 재연결 횟수 초과, 재연결을 중단합니다.')
        }
      }

      ws.onerror = (err) => {
        console.error('🚨 WebSocket 오류:', err)
      }
    }

    intentionalCloseRef.current = false
    reconnectAttemptRef.current = 0
    connect()

    return () => {
      intentionalCloseRef.current = true
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }
      wsRef.current?.close()
    }
  }, [roomId, enabled, accessToken, handleMessage])

  const sendStartScreenShare = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'screen-share-start' }))
    }
  }

  const sendStopScreenShare = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'screen-share-stop' }))
    }
  }

  const startTimer = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'timer-start' }))
    }
  }
  const stopTimer = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'timer-stop' }))
    }
  }

  return {
    sendStartScreenShare,
    sendStopScreenShare,
    startTimer,
    stopTimer,
    socket: wsRef.current,
    isConnected,
  }
}
