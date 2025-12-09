import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import axios from 'axios'
import { OpenVidu, Session as OVSession, Publisher, StreamManager, Subscriber } from 'openvidu-browser'

export default function useHandleController(sessionId: string, userId: string) {
  const [session, setSession] = useState<OVSession>()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [publisher, setPublisher] = useState<Publisher | undefined>()
  const [connectionError, setConnectionError] = useState<Error | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)

  const OV = useRef(new OpenVidu())
  const publisherRef = useRef<Publisher | undefined>(undefined)

  const applicationServerUrl = process.env.NEXT_PUBLIC_OPENVIDU_SERVER_URL

  const openviduSecret = process.env.NEXT_PUBLIC_OPENVIDU_SECRET

  useEffect(() => {
    publisherRef.current = publisher
  }, [publisher])

  const cleanupPublisher = useCallback((target?: Publisher) => {
    if (!target) return

    const mediaStream = target.stream?.getMediaStream()
    mediaStream?.getTracks().forEach((track) => track.stop())

    setPublisher((prev) => (prev === target ? undefined : prev))
  }, [])

  const removeSubscriber = useCallback((streamManager: StreamManager) => {
    setSubscribers((prevSubscribers) => prevSubscribers.filter((sub) => sub.stream.streamManager !== streamManager))
  }, [])

  const attachSessionEvents = useCallback(
    (ovSession: OVSession) => {
      ovSession.on('streamCreated', (event) => {
        try {
          const subscriber = ovSession.subscribe(event.stream, undefined)
          subscriber.on('streamPlaying', () => {
            console.log('✅ Subscriber stream playing')
          })

          setSubscribers((prev) => {
            if (prev.some((sub) => sub.stream.streamId === subscriber.stream.streamId)) {
              return prev
            }
            return [...prev, subscriber]
          })
        } catch (err) {
          console.error('🚨 구독 중 오류:', err)
        }
      })

      ovSession.on('streamDestroyed', (event) => {
        removeSubscriber(event.stream.streamManager)
      })

      ovSession.on('sessionDisconnected', () => {
        console.log('🔌 OpenVidu 세션 해제됨')
        setIsConnected(false)
        setSubscribers([])
        cleanupPublisher(publisherRef.current)
      })

      ovSession.on('exception', (exception) => {
        console.warn('OpenVidu Exception:', exception)
        setConnectionError(new Error(exception.message))
      })
    },
    [cleanupPublisher, removeSubscriber]
  )

  const ensureSession = useCallback(() => {
    if (session) {
      return session
    }

    const newSession = OV.current.initSession()
    attachSessionEvents(newSession)
    setSession(newSession)
    return newSession
  }, [attachSessionEvents, session])

  const createSessionOnServer = useCallback(async () => {
    try {
      const response = await axios.post(
        `${applicationServerUrl}/api/sessions`,
        { customSessionId: sessionId },
        {
          headers: {
            Authorization: `Basic ${btoa(`OPENVIDUAPP:${openviduSecret}`)}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return (response.data.id || response.data) as string
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        return sessionId
      }
      const message =
        axios.isAxiosError(error) && error.response?.data
          ? JSON.stringify(error.response.data)
          : (error as Error).message
      throw new Error(message || '세션 생성 실패')
    }
  }, [applicationServerUrl, openviduSecret, sessionId])

  const createTokenOnServer = useCallback(
    async (targetSessionId: string) => {
      try {
        const response = await axios.post(
          `${applicationServerUrl}/api/sessions/${targetSessionId}/connections`,
          {},
          {
            headers: {
              Authorization: `Basic ${btoa(`OPENVIDUAPP:${openviduSecret}`)}`,
              'Content-Type': 'application/json',
            },
          }
        )
        return (response.data.token || response.data) as string
      } catch (error) {
        const message =
          axios.isAxiosError(error) && error.response?.data
            ? JSON.stringify(error.response.data)
            : (error as Error).message
        throw new Error(message || '토큰 발급 실패')
      }
    },
    [applicationServerUrl, openviduSecret]
  )

  const fetchToken = useCallback(async () => {
    const newSessionId = await createSessionOnServer()
    return createTokenOnServer(newSessionId)
  }, [])

  const joinSession = useCallback(async () => {
    if (isConnecting || isConnected || hasFailed) {
      return session
    }

    const activeSession = ensureSession()
    setIsConnecting(true)

    try {
      const token = await fetchToken()
      await activeSession.connect(token, { clientData: userId })
      setConnectionError(null)
      setIsConnected(true)
      return activeSession
    } catch (error) {
      console.error('🚨 OpenVidu 연결 실패:', error)
      setConnectionError(error as Error)
      setHasFailed(true)
      throw error
    } finally {
      setIsConnecting(false)
    }
  }, [ensureSession, fetchToken, hasFailed, isConnected, isConnecting, session, userId])

  const leaveSession = useCallback(() => {
    if (session) {
      try {
        if (publisher) {
          cleanupPublisher(publisher)
        }
        session.disconnect()
      } catch (error) {
        console.warn('세션 해제 중 오류:', error)
      }
    }

    OV.current = new OpenVidu()
    setSession(undefined)
    setSubscribers([])
    setPublisher(undefined)
    setConnectionError(null)
    setIsConnecting(false)
    setIsConnected(false)
    setHasFailed(false)
  }, [cleanupPublisher, publisher, session])

  useEffect(() => {
    const handleBeforeUnload = () => leaveSession()
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [leaveSession])

  return {
    session,
    subscribers,
    publisher,
    connectionError,
    isConnecting,
    isConnected,
    hasFailed,
    OV,
    joinSession,
    leaveSession,
    setPublisher,
  }
}
