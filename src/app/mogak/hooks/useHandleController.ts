import { useState, useEffect, useCallback, useRef } from 'react'
import { OpenVidu, Session as OVSession, Publisher, StreamManager, Subscriber } from 'openvidu-browser'

export default function useHandleController(sessionId: string, userId: string) {
  const [session, setSession] = useState<OVSession | undefined>()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [publisher, setPublisher] = useState<Publisher | undefined>()
  const [connectionError, setConnectionError] = useState<Error | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const OV = useRef(new OpenVidu())

  const deleteSubscriber = useCallback((streamManager: StreamManager) => {
    setSubscribers((prevSubscribers) => {
      const index = prevSubscribers.indexOf(streamManager as Subscriber)
      if (index > -1) {
        const newSubscribers = [...prevSubscribers]
        newSubscribers.splice(index, 1)
        return newSubscribers
      }
      return prevSubscribers
    })
  }, [])

  const setupSessionEventHandlers = useCallback(
    (mySession: OVSession) => {
      mySession.on('streamCreated', (event) => {
        if (!isConnected) return // 연결 완료 전에는 처리하지 않음

        const subscriber = mySession.subscribe(event.stream, undefined)
        subscriber.on('streamPlaying', () => {
          console.log('✅ Subscriber stream playing')
        })
        setSubscribers((prevSubscribers) => {
          // 중복 구독 방지
          if (prevSubscribers.some((sub) => sub.stream.streamId === subscriber.stream.streamId)) {
            return prevSubscribers
          }
          return [...prevSubscribers, subscriber]
        })
      })

      mySession.on('streamDestroyed', (event) => {
        deleteSubscriber(event.stream.streamManager)
      })

      mySession.on('exception', (exception) => {
        console.warn('OpenVidu Exception:', exception)
        setConnectionError(new Error(exception.message))
      })

      mySession.on('connectionCreated', () => {
        console.log('🔗 OpenVidu 연결 생성됨')
      })

      mySession.on('connectionDestroyed', () => {
        console.log('🔌 OpenVidu 연결 해제됨')
        setIsConnected(false)
      })
    },
    [deleteSubscriber, isConnected]
  )

  const joinSession = useCallback(() => {
    const mySession = OV.current.initSession()

    // 이벤트 핸들러 설정
    setupSessionEventHandlers(mySession)

    setSession(mySession)
  }, [setupSessionEventHandlers])

  const leaveSession = useCallback(() => {
    if (session) {
      try {
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
  }, [session])

  const createSession = useCallback(async (sessionId: string) => {
    const res = await fetch('/api/openvidu/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    const data = await res.json()
    return data.id
  }, [])

  const createToken = useCallback(async (sessionId: string) => {
    const res = await fetch('/api/openvidu/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    const data = await res.json()
    return data.token
  }, [])

  const getToken = useCallback(async () => {
    return createSession(sessionId).then((id) => createToken(id))
  }, [sessionId, createSession, createToken])

  // 세션 연결 관리
  useEffect(() => {
    if (!session || isConnecting) return

    let isConnectingRef = true
    setIsConnecting(true)

    const handleConnect = async () => {
      try {
        const token = await getToken()
        if (!isConnectingRef) return

        await session.connect(token, userId)
        console.log('🔗 OpenVidu 세션에 연결됨')
        setConnectionError(null)
        setIsConnected(true)
      } catch (error) {
        console.error('🚨 OpenVidu 연결 실패:', error)
        setConnectionError(error as Error)

        // 연결 실패 시 재시도 (최대 3회)
        if (isConnectingRef) {
          setTimeout(handleConnect, 2000)
        }
      } finally {
        if (isConnectingRef) {
          setIsConnecting(false)
        }
      }
    }

    handleConnect()

    return () => {
      isConnectingRef = false
    }
  }, [session, userId, getToken])

  // 브라우저 종료 시 세션 정리
  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession)
    return () => window.removeEventListener('beforeunload', leaveSession)
  }, [leaveSession])

  return {
    session,
    subscribers,
    publisher,
    connectionError,
    isConnecting,
    isConnected,
    OV,
    joinSession,
    leaveSession,
    setPublisher,
  }
}
