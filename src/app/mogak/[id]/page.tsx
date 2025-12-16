'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import HeaderFallback from '../components/HeaderFallback'

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

  const getToken = useCallback(async (targetSessionId: string) => {
    // 프록시 API를 통해 세션 생성
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

    // 프록시 API를 통해 토큰 생성
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
  const [isStartingScreenShare, setIsStartingScreenShare] = useState(false)

  const stopScreenShare = useCallback(() => {
    if (!screenPublisher) return
    try {
      if (session) {
        session.unpublish(screenPublisher)
      }
      cleanupPublisher(screenPublisher)
    } catch (err) {
      console.error('화면 공유 중지 오류:', err)
    } finally {
      setScreenPublisher(null)
      setPublisher(null)
    }
  }, [cleanupPublisher, screenPublisher, session])

  const startScreenShare = useCallback(async () => {
    if (!session || !ovRef.current) return
    if (screenPublisher || isStartingScreenShare) {
      console.log('이미 화면 공유 중이거나 시작 중입니다.')
      return
    }

    setIsStartingScreenShare(true)
    let screenPub: Publisher | null = null

    try {
      screenPub = await ovRef.current.initPublisherAsync(undefined, {
        videoSource: 'screen',
        audioSource: false,
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
      console.error('화면 공유 시작 오류:', err)

      // 에러 발생 시 생성된 publisher 정리
      if (screenPub) {
        cleanupPublisher(screenPub)
      }

      // 권한 거부 에러 처리
      const error = err as { name?: string }
      if (error.name === 'DEVICE_ACCESS_DENIED' || error.name === 'NotAllowedError') {
        setIsStartingScreenShare(false)
        startScreenShare()
        return
      }
    } finally {
      setIsStartingScreenShare(false)
    }
  }, [cleanupPublisher, isStartingScreenShare, screenPublisher, session, stopScreenShare])

  const isScreenSharing = !!screenPublisher

  // Data queries
  const { data: TimerList } = useGetTimerList(roomId)
  const timers = TimerList?.timers ?? []

  const { data } = useGetRoomMembers(roomId, userID!, isConnected)

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
        <Suspense fallback={<HeaderFallback />}>
          <MogakHeader id={roomId} />
        </Suspense>

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
