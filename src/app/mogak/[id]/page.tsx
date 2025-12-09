'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import MogakHeader from '../components/MogakHeader'
import MyStatus from '../components/MyStatus'
import ScreenBox from '../components/ScreenBox'
import { OpenVidu, Publisher, StreamManager } from 'openvidu-browser'
import { useGetRoomMembers, useGetTimerList } from '../api/queries'
import { useUserStore } from '@/store/userStore'
import { useRoomStore } from '@/store/roomStore'
import { useLeavePrevention } from '@/hooks/useLeavePrevention'
import LeavePreventionModal from '@/components/global/modal/LeavePreventionModal'

export default function MogakPage() {
  const roomId = useParams().id as string
  const { userID } = useUserStore()
  const { members, setMembers } = useRoomStore()
  const { isModalOpen, confirmLeave, cancelLeave } = useLeavePrevention()

  const ovRef = useRef<OpenVidu | null>(null)
  const [session, setSession] = useState<ReturnType<OpenVidu['initSession']> | null>(null)
  const [publisher, setPublisher] = useState<Publisher | null>(null)
  const [screenPublisher, setScreenPublisher] = useState<Publisher | null>(null)
  const [subscribers, setSubscribers] = useState<StreamManager[]>([])
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [hasFailed, setHasFailed] = useState(false)
  const [connectionError, setConnectionError] = useState<Error | null>(null)

  const serverUrl = useMemo(() => (process.env.NEXT_PUBLIC_OPENVIDU_SERVER_URL || '').replace(/\/$/, ''), [])
  const serverSecret = useMemo(() => process.env.NEXT_PUBLIC_OPENVIDU_SECRET || '', [])

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

  const leaveSession = useCallback(() => {
    if (session) {
      try {
        if (publisher) cleanupPublisher(publisher)
        if (screenPublisher) cleanupPublisher(screenPublisher)
        session.disconnect()
      } catch (err) {
        console.warn('세션 해제 중 오류:', err)
      }
    }
    setSession(null)
    setPublisher(null)
    setScreenPublisher(null)
    setSubscribers([])
    setIsConnected(false)
    setIsConnecting(false)
    setHasFailed(false)
    setConnectionError(null)
    ovRef.current = new OpenVidu()
  }, [cleanupPublisher, publisher, screenPublisher, session])

  useEffect(() => {
    const handleBeforeUnload = () => leaveSession()
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [leaveSession])

  const getToken = useCallback(
    async (targetSessionId: string) => {
      if (!serverUrl || !serverSecret) {
        throw new Error('서버 URL 또는 Secret이 설정되지 않았습니다 (.env 확인).')
      }

      const auth = `Basic ${btoa(`OPENVIDUAPP:${serverSecret}`)}`

      const createSessionRes = await fetch(`${serverUrl}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth,
        },
        body: JSON.stringify({ customSessionId: targetSessionId }),
      })

      if (![200, 201, 409].includes(createSessionRes.status)) {
        const text = await createSessionRes.text()
        throw new Error(`세션 생성 실패 (${createSessionRes.status}): ${text}`)
      }

      const sessionJson = createSessionRes.status === 409 ? { id: targetSessionId } : await createSessionRes.json()
      const finalSessionId = sessionJson.id || targetSessionId

      const tokenRes = await fetch(`${serverUrl}/api/sessions/${finalSessionId}/connection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: auth,
        },
      })

      if (!tokenRes.ok) {
        const text = await tokenRes.text()
        throw new Error(`토큰 생성 실패 (${tokenRes.status}): ${text}`)
      }

      const { token } = await tokenRes.json()
      return token as string
    },
    [serverSecret, serverUrl]
  )

  const joinSession = useCallback(async () => {
    if (!ovRef.current || isConnecting || isConnected || hasFailed) return

    setIsConnecting(true)
    try {
      const token = await getToken(roomId)
      const newSession = ovRef.current.initSession()

      newSession.on('streamCreated', (event) => {
        const subscriber = newSession.subscribe(event.stream, undefined)
        console.log(subscriber, 'subscriber?????????????')
        setSubscribers((prev) => [...prev, subscriber])
      })

      newSession.on('streamDestroyed', (event) => {
        setSubscribers((prev) => prev.filter((sub) => sub !== event.stream.streamManager))
      })

      newSession.on('exception', (event) => {
        console.warn('OpenVidu exception', event)
      })

      await newSession.connect(token, { clientData: String(userID || '') })

      setSession(newSession)
      setIsConnected(true)
      setConnectionError(null)
    } catch (error) {
      console.error('🚨 OpenVidu 연결 실패:', error)
      setConnectionError(error as Error)
      setHasFailed(true)
    } finally {
      setIsConnecting(false)
    }
  }, [getToken, hasFailed, isConnected, isConnecting, roomId, userID])

  // auto-join
  useEffect(() => {
    if (userID && !isConnected && !isConnecting && !hasFailed && !connectionError) {
      joinSession()
    }
  }, [userID, isConnected, isConnecting, hasFailed, connectionError, joinSession])

  // screen share control
  const stopScreenShare = useCallback(() => {
    if (!session || !screenPublisher) return
    try {
      session.unpublish(screenPublisher)
      cleanupPublisher(screenPublisher)
    } catch (err) {
      console.error(err)
    }
    setScreenPublisher(null)
    setPublisher(null)
  }, [cleanupPublisher, screenPublisher, session])

  const startScreenShare = useCallback(async () => {
    if (!session || !ovRef.current || screenPublisher) return
    try {
      const screenPub = await ovRef.current.initPublisherAsync(undefined, {
        videoSource: 'screen',
        audioSource: undefined,
        publishAudio: false,
        publishVideo: true,
        mirror: false,
      })

      const track = screenPub.stream?.getMediaStream()?.getVideoTracks()?.[0]
      if (track) {
        track.onended = () => stopScreenShare()
      }

      await session.publish(screenPub)
      setScreenPublisher(screenPub)
      setPublisher(screenPub)
    } catch (err) {
      console.error(err)
    }
  }, [screenPublisher, session, stopScreenShare])

  const isScreenSharing = !!screenPublisher

  // Data queries
  const { data: TimerList } = useGetTimerList(roomId)
  const timers = TimerList?.timers ?? []

  const { data } = useGetRoomMembers(roomId)

  useEffect(() => {
    if (data?.users) {
      setMembers(data.users)
    }
  }, [data, setMembers])

  const mappedMembers = useMemo(() => {
    if (!timers.length || !members.length) return []

    return members
      .filter((member) => member.userId !== Number(userID))
      .map((member) => {
        const subscriber = subscribers.find((sub) => {
          const raw = sub.stream.connection.data
          try {
            const parsed = JSON.parse(raw)
            return Number(parsed?.clientData ?? parsed) === member.userId
          } catch {
            return Number(raw) === member.userId
          }
        })

        const timer = timers.find((t) => t.userId === member.userId)

        return {
          userId: member.userId,
          nickName: member.nickName,
          subscriber,
          timer: {
            time: timer ? timer.hour * 3600 + timer.min * 60 + timer.sec : 0,
            isRunning: timer?.isRunning ?? false,
          },
        }
      })
  }, [members, timers, subscribers, userID])

  return (
    <>
      <div className="min-w-[1280px] overflow-hidden">
        <MogakHeader id={roomId} />
        <div className="px-80 pt-16 flex gap-15 min-h-500 h-full">
          <MyStatus
            startScreenShare={startScreenShare}
            stopScreenShare={stopScreenShare}
            publisher={publisher as Publisher}
            isScreenSharing={isScreenSharing}
          />
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {mappedMembers.map(({ userId, nickName, subscriber, timer }) => (
              <ScreenBox
                key={userId}
                nickname={nickName}
                time={timer.time}
                isRunning={timer.isRunning}
                subscriber={subscriber}
              />
            ))}
          </div>
        </div>
      </div>

      <LeavePreventionModal isOpen={isModalOpen} onClose={cancelLeave} onConfirm={confirmLeave} />
    </>
  )
}
