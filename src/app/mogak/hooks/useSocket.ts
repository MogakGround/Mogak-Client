'use client'

import { useAuthStore } from '@/store/authStore'
import { useRoomStore } from '@/store/roomStore'
import { useUserStore } from '@/store/userStore'
import { useEffect, useRef } from 'react'

export default function useSocket(roomId: string) {
  const wsRef = useRef<WebSocket | null>(null)

  const { accessToken } = useAuthStore.getState()
  const { userID } = useUserStore.getState()
  const addMember = useRoomStore((s) => s.addMember)
  const removeMember = useRoomStore((s) => s.removeMember)

  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_SOCKET_URL}?token=${accessToken}&roomId=${roomId}`)

    wsRef.current = ws

    ws.onopen = () => {
      console.log('✅ WebSocket 연결 성공')
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log('📩 서버 메시지:', data)

      if (data.type === 'screen-share-start') {
        console.log('🖥️ 화면 공유 시작됨!')
      }
      if (data.type === 'participant-joined') {
        if (data.data != undefined && data.data.userId != userID) {
          addMember(data.data)
          console.log('유저 참가', data)
        }
      }
      if (data.type === 'participant-left') {
        removeMember(data.userId)
        console.log('유저 연결 종료')
      }
    }

    ws.onclose = () => {
      console.log('❌ WebSocket 연결 종료')
    }

    ws.onerror = (err) => {
      console.error('🚨 WebSocket 오류:', err)
    }

    return () => {
      ws.close()
    }
  }, [roomId])

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
    wsRef.current?.send(JSON.stringify({ type: 'timer-start' }))
  }
  const stopTimer = () => {
    wsRef.current?.send(JSON.stringify({ type: 'timer-stop' }))
  }

  return {
    sendStartScreenShare,
    sendStopScreenShare,
    startTimer,
    stopTimer,
    socket: wsRef.current,
  }
}
