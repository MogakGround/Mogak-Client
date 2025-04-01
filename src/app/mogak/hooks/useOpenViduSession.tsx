import { useState, useEffect, useCallback, useRef } from 'react'
import { OpenVidu, Session as OVSession, Publisher, StreamManager, Subscriber } from 'openvidu-browser'
import axios from 'axios'
import { useRoomStore } from '@/store/roomStore'

export default function useOpenViduSession(sessionId: string, userId: string) {
  const [session, setSession] = useState<OVSession | undefined>()
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [publisher, setPublisher] = useState<Publisher | undefined>()

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
  }, [session])

  const deleteSubscriber = useCallback((streamManager: StreamManager) => {
    setSubscribers((prevSubscribers) => {
      const index = prevSubscribers.indexOf(streamManager as Subscriber)
      if (index > -1) {
        const newSubscribers = [...prevSubscribers]
        newSubscribers.splice(index, 1)
        return newSubscribers
      } else {
        return prevSubscribers
      }
    })
  }, [])

  const joinSession = useCallback(() => {
    const mySession = OV.current.initSession()

    mySession.on('streamCreated', (event) => {
      const subscriber = mySession.subscribe(event.stream, undefined)
      console.log('참여 subscriber :::: ', subscriber)
      setSubscribers((subscribers) => [...subscribers, subscriber])
    })

    mySession.on('streamDestroyed', (event) => {
      deleteSubscriber(event.stream.streamManager)
    })

    mySession.on('exception', (exception) => {
      console.warn(exception)
    })

    setSession(mySession)
  }, [])

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

    getToken()
      .then(async (token) => {
        try {
          await session.connect(token, userId)
          console.log('🔗 OpenVidu 세션에 연결됨')
        } catch (error) {
          console.log(error, '🚨 OpenVidu 연결 실패')
        }
      })
      .catch((error) => {
        console.error('Error getting token:', error)
      })
  }, [session])

  /* 브라우저 종료 시 세션 정리 */
  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession)
    return () => window.removeEventListener('beforeunload', leaveSession)
  }, [leaveSession])

  return {
    session,
    subscribers,
    publisher,
    joinSession,
    leaveSession,
    startScreenShare,
    stopScreenShare,
  }
}
