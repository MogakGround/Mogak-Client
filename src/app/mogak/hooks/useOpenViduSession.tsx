import { useState, useEffect, useCallback } from 'react'
import { OpenVidu, Session as OVSession, Publisher, StreamEvent, Subscriber } from 'openvidu-browser'
import axios from 'axios'

export default function useOpenViduSession(sessionId: string) {
  const [session, setSession] = useState<OVSession | null>(null)
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [publisher, setPublisher] = useState<Publisher | null>(null)
  const [OV, setOV] = useState<OpenVidu | null>(null)

  const OPENVIDU_SERVER_URL = `https://${window.location.hostname}:4443`
  const OPENVIDU_SERVER_SECRET = 'MY_SECRET'

  const leaveSession = useCallback(() => {
    if (session) session.disconnect()
    setOV(null)
    setSession(null)
    setSubscribers([])
    setPublisher(null)
  }, [session])

  const joinSession = () => {
    const OVs = new OpenVidu()
    setOV(OVs)
    setSession(OVs.initSession())
  }

  useEffect(() => {
    window.addEventListener('beforeunload', leaveSession)
    return () => window.removeEventListener('beforeunload', leaveSession)
  }, [leaveSession])

  useEffect(() => {
    if (!session) return

    const handleStreamCreated = (event: StreamEvent | unknown) => {
      if (!(event instanceof StreamEvent) || !session) return
      const newSubscriber = session.subscribe(event.stream, '')
      setSubscribers((prevSubscribers) =>
        prevSubscribers.some((sub) => sub.stream.streamId === newSubscriber.stream.streamId)
          ? prevSubscribers
          : [...prevSubscribers, newSubscriber]
      )
    }

    const handleStreamDestroyed = (event: StreamEvent | unknown) => {
      if (!(event instanceof StreamEvent)) return
      setSubscribers((prevSubscribers) =>
        prevSubscribers.filter((sub) => sub.stream.streamId !== event.stream.streamId)
      )
    }

    session.on('streamCreated', handleStreamCreated)
    session.on('streamDestroyed', handleStreamDestroyed)

    return () => {
      session.off('streamCreated', handleStreamCreated)
      session.off('streamDestroyed', handleStreamDestroyed)
    }
  }, [session])

  useEffect(() => {
    if (!session) return

    const createSession = async (): Promise<string> => {
      try {
        const response = await axios.post(
          `${OPENVIDU_SERVER_URL}/openvidu/api/sessions`,
          { customSessionId: sessionId },
          {
            headers: {
              Authorization: `Basic ${btoa(`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`)}`,
              'Content-Type': 'application/json',
            },
          }
        )
        return response.data.id
      } catch (error: any) {
        return error.response?.status === 409 ? sessionId : ''
      }
    }

    const createToken = async (): Promise<string> => {
      const response = await axios.post(
        `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
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

    const getToken = async (): Promise<string> => {
      await createSession()
      return createToken()
    }

    getToken()
      .then((token) => {
        session
          .connect(token)
          .then(() => {
            if (OV) {
              const newPublisher = OV.initPublisher('', {
                audioSource: false,
                videoSource: undefined,
                publishAudio: true,
                publishVideo: false,
                mirror: true,
              })
              setPublisher(newPublisher)
              session.publish(newPublisher).catch(console.error)
            }
          })
          .catch(console.error)
      })
      .catch(console.error)
  }, [session, OV, sessionId])

  return { session, subscribers, publisher, joinSession, leaveSession }
}
