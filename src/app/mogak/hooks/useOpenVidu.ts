'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { OpenVidu, Publisher, StreamManager } from 'openvidu-browser'

export default function useOpenVidu(roomId: string, userId: number | undefined, isRoomEntered: boolean) {
  const ovRef = useRef<OpenVidu | null>(null)
  const [session, setSession] = useState<ReturnType<OpenVidu['initSession']> | null>(null)
  const [subscribers, setSubscribers] = useState<StreamManager[]>([])
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

      newSession.on('streamCreated', (event) => {
        const subscriber = newSession.subscribe(event.stream, undefined)
        setSubscribers((prev) => [...prev, subscriber])
      })

      newSession.on('streamDestroyed', (event) => {
        setSubscribers((prev) => prev.filter((sub) => sub !== event.stream.streamManager))
      })

      newSession.on('exception', (event) => {
        console.warn('OpenVidu exception', event)
      })

      await newSession.connect(token, { clientData: String(userId || '') })

      setSession(newSession)
      setConnectionError(null)
    } catch (error) {
      console.error('OpenVidu 연결 실패:', error)
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

  return {
    session,
    subscribers,
    isConnecting,
    hasFailed,
    connectionError,
    joinSession,
    leaveSession,
    ovRef,
    cleanupPublisher,
  }
}
