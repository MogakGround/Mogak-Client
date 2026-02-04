'use client'

import { useAuthStore } from '@/store/authStore'
import { useRoomStore } from '@/store/roomStore'
import { useUserStore } from '@/store/userStore'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function useSocket(roomId: string, enabled: boolean = true) {
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [screenSharingUsers, setScreenSharingUsers] = useState<Set<number>>(new Set())

  const { accessToken } = useAuthStore.getState()
  const { userID } = useUserStore.getState()
  const addMember = useRoomStore((s) => s.addMember)
  const removeMember = useRoomStore((s) => s.removeMember)

  const queryClient = useQueryClient()

  const addScreenSharingUser = useCallback((userId: number) => {
    setScreenSharingUsers((prev) => new Set(prev).add(userId))
  }, [])

  const removeScreenSharingUser = useCallback((userId: number) => {
    setScreenSharingUsers((prev) => {
      const next = new Set(prev)
      next.delete(userId)
      return next
    })
  }, [])

  useEffect(() => {
    if (!enabled) return

    const wsUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}?token=${accessToken}&roomId=${roomId}`
    console.log('🔌 WebSocket 연결 시도:', wsUrl)

    const ws = new WebSocket(wsUrl)

    wsRef.current = ws

    ws.onopen = () => {
      console.log('✅ WebSocket 연결 성공')
      setIsConnected(true)
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('📩 서버 메시지:', data)

      if (data.type === 'screen-share-start') {
        console.log('🖥️ 화면 공유 시작됨! userId:', data.userId)
        if (data.userId != null) {
          addScreenSharingUser(Number(data.userId))
        }
      }
      if (data.type === 'screen-share-stop') {
        console.log('🖥️ 화면 공유 종료됨! userId:', data.userId)
        if (data.userId != null) {
          removeScreenSharingUser(Number(data.userId))
        }
      }
      if (data.type === 'participant-joined') {
        if (data.data != undefined && data.data.userId != userID) {
          addMember(data.data)
          queryClient.invalidateQueries({ queryKey: ['roomMembers', roomId] })
          console.log('유저 참가', data)
        }
      }
      if (data.type === 'participant-left') {
        removeMember(data.userId)
        removeScreenSharingUser(Number(data.userId))
        console.log('유저 연결 종료')
      }
    }

    ws.onclose = (event) => {
      console.log('❌ WebSocket 연결 종료:', { code: event.code, reason: event.reason })
      setIsConnected(false)
    }

    ws.onerror = (err) => {
      console.error('🚨 WebSocket 오류:', err)
      console.error('🔗 연결 URL:', wsUrl)
    }

    return () => {
      ws.close()
    }
  }, [roomId, enabled, addScreenSharingUser, removeScreenSharingUser])

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
    screenSharingUsers,
  }
}
