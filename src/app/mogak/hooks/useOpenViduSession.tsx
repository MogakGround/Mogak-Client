import { useState, useEffect, useCallback, useRef } from 'react'
import { OpenVidu, Session as OVSession, Publisher, StreamManager, Subscriber } from 'openvidu-browser'
import axios from 'axios'
import { useRoomStore } from '@/store/roomStore'

export default function useOpenViduSession(sessionId: string, userId: string) {
  const [session, setSession] = useState<OVSession | undefined>()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [publisher, setPublisher] = useState<Publisher | undefined>()
  const [connectionError, setConnectionError] = useState<Error | null>(null)

  const { setScreenShareOn } = useRoomStore()

  const OV = useRef(new OpenVidu())

  const OPENVIDU_SERVER_URL = process.env.NEXT_PUBLIC_OPENVIDU_SERVER_URL
  const OPENVIDU_SERVER_SECRET = process.env.NEXT_PUBLIC_OPENVIDU_SERVER_SECRET

  const startScreenShare = async () => {
    if (!OV.current || !session) return

    try {
      if (publisher) stopScreenShare()

      const newPublisher = OV.current.initPublisher(undefined, {
        videoSource: 'screen',
        publishAudio: false,
        resolution: '1280x720',
        frameRate: 30,
      })

      newPublisher.on('accessAllowed', () => {
        console.log('✅ 화면 공유 권한 허용됨')
        session.publish(newPublisher)
        setPublisher(newPublisher)
        setScreenShareOn(true)
      })

      newPublisher.on('accessDenied', () => {
        console.warn('🚨 화면 공유 권한이 거부되었습니다.')
      })

      // 스트림 종료 이벤트 처리
      newPublisher.on('streamDestroyed', () => {
        stopScreenShare()
      })
    } catch (error) {
      console.error('화면 공유 오류:', error)
    }
  }

  const stopScreenShare = () => {
    if (publisher && session) {
      console.log('📴 화면 공유 중지')

      session.unpublish(publisher)
      setPublisher(undefined)
      setScreenShareOn(false)
    }
  }

  const leaveSession = useCallback(() => {
    if (session) {
      session.disconnect()
    }

    OV.current = new OpenVidu()
    setSession(undefined)
    setSubscribers([])
    setPublisher(undefined)
    setConnectionError(null)
  }, [session])

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

  const joinSession = useCallback(() => {
    const mySession = OV.current.initSession()

    mySession.on('streamCreated', (event) => {
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

    setSession(mySession)
  }, [deleteSubscriber])

  const createSession = async (sessionId: string): Promise<string> => {
    try {
      const response = await axios.post(
        `${OPENVIDU_SERVER_URL}/api/sessions`,
        { customSessionId: sessionId },
        {
          headers: {
            Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data.id
    } catch (error) {
      const err = error as { response?: { status?: number } }
      console.log('createSession Error', error)
      return err.response?.status === 409 ? sessionId : ''
    }
  }

  const createToken = async (sessionId: string): Promise<string> => {
    const response = await axios.post(
      `${OPENVIDU_SERVER_URL}/api/sessions/${sessionId}/connection`,
      {},
      {
        headers: {
          Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data.token
  }

  const getToken = useCallback(async () => {
    return createSession(sessionId).then((id) => createToken(id))
  }, [sessionId])

  useEffect(() => {
    if (!session) return

    let isConnecting = true

    const connectSession = async () => {
      try {
        const token = await getToken()
        if (!isConnecting) return

        await session.connect(token, userId)
        console.log('🔗 OpenVidu 세션에 연결됨')
        setConnectionError(null)
      } catch (error) {
        console.error('🚨 OpenVidu 연결 실패:', error)
        setConnectionError(error as Error)

        // 연결 실패 시 재시도
        if (isConnecting) {
          setTimeout(connectSession, 2000)
        }
      }
    }

    connectSession()

    return () => {
      isConnecting = false
    }
  }, [session, userId, getToken])

  /* 브라우저 종료 시 세션 정리 */
  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession)
    return () => window.removeEventListener('beforeunload', leaveSession)
  }, [leaveSession])

  return {
    session,
    subscribers,
    publisher,
    connectionError,
    joinSession,
    leaveSession,
    startScreenShare,
    stopScreenShare,
  }
}
