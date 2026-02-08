'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { OpenVidu, Publisher, StreamManager, Stream } from 'openvidu-browser'
import { useLatestRef } from '@/hooks/useLatestRef'

interface UseOpenViduOptions {
  onMemberJoined?: (userId: number) => void
  onMemberLeft?: (userId: number) => void
}

function parseUserId(connectionData: string | undefined): number | null {
  if (!connectionData) return null
  try {
    const parsed = JSON.parse(connectionData)
    return Number(parsed?.clientData ?? parsed)
  } catch {
    const num = Number(connectionData)
    return isNaN(num) ? null : num
  }
}

function isScreenShareStream(stream: Stream | undefined): boolean {
  return stream?.typeOfVideo === 'SCREEN'
}

// Performance logging for screen share detection comparison
const logOpenViduScreenShare = (userId: number, action: 'start' | 'stop') => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ScreenShare:OpenVidu] detected ${action} for user ${userId} at ${Date.now()}`)
  }
}

export default function useOpenVidu(
  roomId: string,
  userId: number | undefined,
  isRoomEntered: boolean,
  options?: UseOpenViduOptions,
) {
  const onMemberJoinedRef = useLatestRef(options?.onMemberJoined)
  const onMemberLeftRef = useLatestRef(options?.onMemberLeft)
  const ovRef = useRef<OpenVidu | null>(null)
  const [session, setSession] = useState<ReturnType<OpenVidu['initSession']> | null>(null)
  const [subscribers, setSubscribers] = useState<StreamManager[]>([])
  const [screenSharingUsers, setScreenSharingUsers] = useState<Set<number>>(new Set())
  const [isConnecting, setIsConnecting] = useState(false)
  const isConnectingRef = useRef(false)
  const [hasFailed, setHasFailed] = useState(false)
  const [connectionError, setConnectionError] = useState<Error | null>(null)

  useEffect(() => {
    ovRef.current = new OpenVidu()
    return () => {
      ovRef.current = null
    }
  }, [])

  const cleanupPublisher = useCallback((target?: Publisher | null) => {
    if (!target) return
    target.stream
      ?.getMediaStream()
      ?.getTracks()
      ?.forEach((track) => track.stop())
  }, [])

  const getToken = useCallback(async (targetSessionId: string) => {
    const createSessionRes = await fetch('/api/openvidu/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customSessionId: targetSessionId }),
    })

    if (!createSessionRes.ok) {
      const data = await createSessionRes.json()
      throw new Error(data.error || '세션 생성 실패')
    }

    const sessionJson = await createSessionRes.json()
    const finalSessionId = sessionJson.id || targetSessionId

    const tokenRes = await fetch(`/api/openvidu/sessions/${finalSessionId}/connection`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!tokenRes.ok) {
      const data = await tokenRes.json()
      throw new Error(data.error || '토큰 생성 실패')
    }

    const { token } = await tokenRes.json()
    return token as string
  }, [])

  const joinSession = useCallback(async () => {
    if (!ovRef.current || isConnectingRef.current || session || hasFailed) return

    isConnectingRef.current = true
    setIsConnecting(true)
    try {
      const token = await getToken(roomId)
      const newSession = ovRef.current.initSession()

      const subscribedStreamIds = new Set<string>()

      const subscribeToStream = (stream: Stream) => {
        if (subscribedStreamIds.has(stream.streamId)) {
          console.log('[OpenVidu] Already subscribed to stream:', stream.streamId)
          return null
        }

        try {
          const subscriber = newSession.subscribe(stream, undefined)
          subscribedStreamIds.add(stream.streamId)

          setSubscribers((prev) => {
            const exists = prev.some((s) => s.stream?.streamId === stream.streamId)
            if (exists) return prev
            return [...prev, subscriber]
          })

          if (isScreenShareStream(stream)) {
            const streamUserId = parseUserId(stream.connection?.data)
            if (streamUserId != null) {
              logOpenViduScreenShare(streamUserId, 'start')
              setScreenSharingUsers((prev) => new Set(prev).add(streamUserId))
            }
          }

          return subscriber
        } catch (err) {
          console.error('[OpenVidu] Failed to subscribe to stream:', stream.streamId, err)
          return null
        }
      }

      newSession.on('streamCreated', (event) => {
        console.log('[OpenVidu] streamCreated:', event.stream.streamId, event.stream.typeOfVideo)
        subscribeToStream(event.stream)
      })

      newSession.on('streamDestroyed', (event) => {
        console.log('[OpenVidu] streamDestroyed:', event.stream.streamId)
        subscribedStreamIds.delete(event.stream.streamId)

        setSubscribers((prev) => prev.filter((sub) => sub.stream?.streamId !== event.stream.streamId))

        if (isScreenShareStream(event.stream)) {
          const streamUserId = parseUserId(event.stream.connection?.data)
          if (streamUserId != null) {
            logOpenViduScreenShare(streamUserId, 'stop')
            setScreenSharingUsers((prev) => {
              const next = new Set(prev)
              next.delete(streamUserId)
              return next
            })
          }
        }
      })

      newSession.on('exception', (event) => {
        console.warn('[OpenVidu] exception:', event)
      })

      await newSession.connect(token, { clientData: String(userId || '') })
      console.log('[OpenVidu] Connected to session')

      setTimeout(() => {
        try {
          const remoteConnections = newSession.remoteConnections
          if (remoteConnections && remoteConnections.size > 0) {
            console.log('[OpenVidu] Found existing connections:', remoteConnections.size)
            remoteConnections.forEach((connection) => {
              if (connection.stream && !subscribedStreamIds.has(connection.stream.streamId)) {
                console.log('[OpenVidu] Subscribing to existing stream:', connection.stream.streamId)
                subscribeToStream(connection.stream)
              }
            })
          }
        } catch (err) {
          console.warn('[OpenVidu] Error checking existing streams:', err)
        }
      }, 500)

      setSession(newSession)
      setConnectionError(null)
    } catch (error) {
      console.error('[OpenVidu] 연결 실패:', error)
      setConnectionError(error as Error)
      setHasFailed(true)
    } finally {
      isConnectingRef.current = false
      setIsConnecting(false)
    }
  }, [getToken, hasFailed, session, roomId, userId])

  const leaveSession = useCallback(() => {
    if (session) {
      try {
        session.disconnect()
      } catch (err) {
        console.warn('세션 해제 중 오류:', err)
      }
    }
    setSession(null)
    setSubscribers([])
    setScreenSharingUsers(new Set())
    setIsConnecting(false)
    setHasFailed(false)
    setConnectionError(null)
    ovRef.current = new OpenVidu()
  }, [session])

  // auto-join
  useEffect(() => {
    if (isRoomEntered && userId && !session && !isConnecting && !hasFailed && !connectionError) {
      joinSession()
    }
  }, [isRoomEntered, userId, session, isConnecting, hasFailed, connectionError, joinSession])

  useEffect(() => {
    if (!session) return

    const handleConnectionCreated = (event: { connection: { data: string } }) => {
      const connUserId = parseUserId(event.connection.data)
      if (connUserId != null && connUserId !== userId) {
        onMemberJoinedRef.current?.(connUserId)
      }
    }

    const handleConnectionDestroyed = (event: { connection: { data: string } }) => {
      const connUserId = parseUserId(event.connection.data)
      if (connUserId != null && connUserId !== userId) {
        onMemberLeftRef.current?.(connUserId)
      }
    }

    session.on('connectionCreated', handleConnectionCreated)
    session.on('connectionDestroyed', handleConnectionDestroyed)

    return () => {
      session.off('connectionCreated', handleConnectionCreated)
      session.off('connectionDestroyed', handleConnectionDestroyed)
    }
  }, [session, userId])

  return {
    session,
    subscribers,
    screenSharingUsers,
    isConnecting,
    hasFailed,
    connectionError,
    joinSession,
    leaveSession,
    ovRef,
    cleanupPublisher,
  }
}
