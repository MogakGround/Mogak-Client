'use client'

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MogakHeader from '../components/MogakHeader'
import MyStatus from '../components/MyStatus'
import ScreenBox from '../components/ScreenBox'
import { OpenVidu, Publisher, StreamManager } from 'openvidu-browser'
import { useGetRoomMembers, useGetTimerList } from '../api/queries'
import { postLeaveRoomBeacon } from '../api/api'
import { postEnterRoom } from '@/app/api/home/api'
import useSocket from '../hooks/useSocket'
import { useUserStore } from '@/store/userStore'
import { useRoomStore } from '@/store/roomStore'
import { useLeavePrevention } from '@/hooks/useLeavePrevention'
import LeavePreventionModal from '@/components/global/modal/LeavePreventionModal'
import HeaderFallback from '../components/HeaderFallback'

export default function MogakPage() {
  const roomId = useParams().id as string
  const router = useRouter()
  const { userID } = useUserStore()
  const { members, setMembers, setScreenShareOn } = useRoomStore()
  const { isModalOpen, confirmLeave, cancelLeave } = useLeavePrevention()
  const [isRoomEntered, setIsRoomEntered] = useState(false)

  useEffect(() => {
    const enteredRoom = sessionStorage.getItem('enteredRoom')
    if (enteredRoom === roomId) {
      sessionStorage.removeItem('enteredRoom')
      setIsRoomEntered(true)
      return
    }

    const enterRoom = async () => {
      try {
        await postEnterRoom(Number(roomId), {
          isScreenShared: false,
          isVideoLargeAllowed: false,
        })
        setIsRoomEntered(true)
      } catch (error) {
        console.error('방 입장 실패:', error)
        router.replace('/')
      }
    }
    enterRoom()
  }, [roomId, router])

  const {
    isConnected: isSocketConnected,
    sendStartScreenShare,
    sendStopScreenShare,
    startTimer,
    stopTimer,
    screenSharingUsers,
  } = useSocket(roomId, isRoomEntered)

  const ovRef = useRef<OpenVidu | null>(null)
  const [session, setSession] = useState<ReturnType<OpenVidu['initSession']> | null>(null)
  const [publisher, setPublisher] = useState<Publisher | null>(null)
  const [screenPublisher, setScreenPublisher] = useState<Publisher | null>(null)
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
    setIsConnecting(false)
    setHasFailed(false)
    setConnectionError(null)
    ovRef.current = new OpenVidu()
  }, [cleanupPublisher, publisher, screenPublisher, session])

  useEffect(() => {
    const handleBeforeUnload = () => {
      postLeaveRoomBeacon(Number(roomId)) // sendBeacon으로 방 나가기 요청
      leaveSession() // OpenVidu 세션 정리
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      postLeaveRoomBeacon(Number(roomId)) // 페이지 언마운트 시에도 방 나가기
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [leaveSession, roomId])

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
      setConnectionError(null)
    } catch (error) {
      console.error('🚨 OpenVidu 연결 실패:', error)
      setConnectionError(error as Error)
      setHasFailed(true)
    } finally {
      isConnectingRef.current = false
      setIsConnecting(false)
    }
  }, [getToken, hasFailed, session, roomId, userID])

  // auto-join
  useEffect(() => {
    if (userID && !session && !isConnecting && !hasFailed && !connectionError) {
      joinSession()
    }
  }, [userID, session, isConnecting, hasFailed, connectionError, joinSession])

  // screen share control
  const [isStartingScreenShare, setIsStartingScreenShare] = useState(false)

  const stopScreenShare = useCallback(() => {
    try {
      if (screenPublisher) {
        if (session) {
          session.unpublish(screenPublisher)
        }
        cleanupPublisher(screenPublisher)
      }
    } catch (err) {
      console.error('화면 공유 중지 오류:', err)
    } finally {
      setScreenPublisher(null)
      setPublisher(null)
      setScreenShareOn(false)
    }
  }, [cleanupPublisher, screenPublisher, session, setScreenShareOn])

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

      // 화면 공유 거부/취소 시 토글 끄기
      setScreenShareOn(false)
    } finally {
      setIsStartingScreenShare(false)
    }
  }, [cleanupPublisher, isStartingScreenShare, screenPublisher, session, stopScreenShare, setScreenShareOn])

  const isScreenSharing = !!screenPublisher

  const { data: TimerList } = useGetTimerList(roomId)
  const timers = TimerList?.timers ?? []

  const { data } = useGetRoomMembers(roomId, userID!, isSocketConnected)

  useEffect(() => {
    if (data?.users) {
      setMembers(data.users)
    }
  }, [data, setMembers])

  const mappedMembers = useMemo(() => {
    if (!members.length) return []

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
        const isScreenSharing = screenSharingUsers.has(member.userId)

        return {
          userId: member.userId,
          nickName: member.nickName,
          subscriber,
          timer: {
            time: timer ? timer.hour * 3600 + timer.min * 60 + timer.sec : 0,
            isRunning: isScreenSharing || (timer?.isRunning ?? false),
          },
        }
      })
  }, [members, timers, subscribers, userID, screenSharingUsers])

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
            sendStartScreenShare={sendStartScreenShare}
            sendStopScreenShare={sendStopScreenShare}
            startTimer={startTimer}
            stopTimer={stopTimer}
          />
          {mappedMembers.length > 0 ? (
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
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-[2px] w-[273px]">
                <p className="text-white text-lg font-semibold">아직 모각방에 입장한 사람이 없어요.</p>
                <p className="text-gray-400 text-sm">모각방에 같이 작업할 사람을 초대해보세요!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <LeavePreventionModal isOpen={isModalOpen} onClose={cancelLeave} onConfirm={confirmLeave} />
    </>
  )
}
