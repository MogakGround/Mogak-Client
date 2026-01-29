'use client'

import { useAuthStore } from '@/store/authStore'
import { useRoomStore } from '@/store/roomStore'
import { useUserStore } from '@/store/userStore'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { User } from '../api/type'

const MAX_RECONNECT_ATTEMPTS = 5
const BASE_RECONNECT_DELAY_MS = 1000

export default function useSocket(roomId: string) {
  const wsRef = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [screenSharingUsers, setScreenSharingUsers] = useState<Set<number>>(new Set())

  const addMember = useRoomStore((s) => s.addMember)
  const removeMember = useRoomStore((s) => s.removeMember)

  const queryClient = useQueryClient()

  const reconnectAttemptRef = useRef(0)
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intentionalCloseRef = useRef(false)

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

  const connect = useCallback(() => {
    // Read fresh token/userID on each connection attempt
    const accessToken = useAuthStore.getState().accessToken
    const userID = useUserStore.getState().userID

    if (!accessToken) return

    const wsUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}?token=${accessToken}&roomId=${roomId}`
    const ws = new WebSocket(wsUrl)

    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
      reconnectAttemptRef.current = 0
    }

    ws.onmessage = (event) => {
      let data: Record<string, unknown>
      try {
        data = JSON.parse(event.data)
      } catch {
        console.error('WebSocket: 잘못된 메시지 형식 수신')
        return
      }

      switch (data.type) {
        case 'screen-share-start':
          if (data.userId != null) {
            addScreenSharingUser(Number(data.userId))
          }
          break
        case 'screen-share-stop':
          if (data.userId != null) {
            removeScreenSharingUser(Number(data.userId))
          }
          break
        case 'participant-joined': {
          const joinedUser = data.data as User | undefined
          if (joinedUser != null && joinedUser.userId !== userID) {
            addMember(joinedUser)
            queryClient.invalidateQueries({ queryKey: ['roomMembers', roomId] })
          }
          break
        }
        case 'participant-left':
          removeMember(data.userId as number)
          removeScreenSharingUser(Number(data.userId))
          break
      }
    }

    ws.onclose = (event) => {
      setIsConnected(false)
      wsRef.current = null

      // Do not reconnect if intentionally closed or normal closure
      if (intentionalCloseRef.current || event.code === 1000) return

      // Exponential backoff reconnection
      if (reconnectAttemptRef.current < MAX_RECONNECT_ATTEMPTS) {
        const delay = BASE_RECONNECT_DELAY_MS * Math.pow(2, reconnectAttemptRef.current)
        reconnectAttemptRef.current += 1

        reconnectTimerRef.current = setTimeout(() => {
          if (!intentionalCloseRef.current) {
            connect()
          }
        }, delay)
      }
    }

    ws.onerror = () => {
      // onerror always fires before onclose; reconnection is handled in onclose
    }
  }, [roomId, addMember, removeMember, addScreenSharingUser, removeScreenSharingUser, queryClient])

  useEffect(() => {
    intentionalCloseRef.current = false
    connect()

    return () => {
      intentionalCloseRef.current = true

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current)
        reconnectTimerRef.current = null
      }

      if (wsRef.current) {
        wsRef.current.close(1000, 'component unmount')
        wsRef.current = null
      }
    }
  }, [connect])

  const send = useCallback((message: Record<string, unknown>) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
    }
  }, [])

  const sendStartScreenShare = useCallback(() => {
    send({ type: 'screen-share-start' })
  }, [send])

  const sendStopScreenShare = useCallback(() => {
    send({ type: 'screen-share-stop' })
  }, [send])

  const startTimer = useCallback(() => {
    send({ type: 'timer-start' })
  }, [send])

  const stopTimer = useCallback(() => {
    send({ type: 'timer-stop' })
  }, [send])

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
