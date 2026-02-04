'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import MogakHeader from '../components/MogakHeader'
import MyStatus from '../components/MyStatus'
import ScreenBox from '../components/ScreenBox'
import { Publisher } from 'openvidu-browser'
import { useQueryClient } from '@tanstack/react-query'
import { useGetRoomMembers, useGetTimerList } from '../api/queries'
import { postLeaveRoomBeacon } from '../api/api'
import { postEnterRoom } from '@/app/api/home/api'
import useSocket from '../hooks/useSocket'
import useOpenVidu from '../hooks/useOpenVidu'
import useScreenShare from '../hooks/useScreenShare'
import { useUserStore } from '@/store/userStore'
import { useRoomStore } from '@/store/roomStore'
import { useLeavePrevention } from '@/hooks/useLeavePrevention'
import LeavePreventionModal from '@/components/global/modal/LeavePreventionModal'
import HeaderFallback from '../components/HeaderFallback'

export default function MogakPage() {
  const roomId = useParams().id as string
  const router = useRouter()
  const { userID } = useUserStore()
  const { members, setMembers, removeMember } = useRoomStore()
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
  } = useSocket(roomId, isRoomEntered)

  const { session, subscribers, screenSharingUsers, leaveSession, ovRef, cleanupPublisher } = useOpenVidu(
    roomId,
    userID ?? undefined,
    isRoomEntered,
  )

  const { publisher, startScreenShare, stopScreenShare, isScreenSharing } = useScreenShare({
    session,
    ovRef,
    cleanupPublisher,
    sendStartScreenShare,
    sendStopScreenShare,
  })

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopScreenShare()
      leaveSession()
      postLeaveRoomBeacon(Number(roomId))
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      postLeaveRoomBeacon(Number(roomId))
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [stopScreenShare, leaveSession, roomId])

  const { data: TimerList } = useGetTimerList(roomId, isRoomEntered)
  const timers = TimerList?.timers ?? []

  const { data } = useGetRoomMembers(roomId, userID!, isRoomEntered && isSocketConnected)

  useEffect(() => {
    if (data?.users) {
      setMembers(data.users)
    }
  }, [data, setMembers])

  const queryClient = useQueryClient()

  useEffect(() => {
    if (!session) return

    const parseUserId = (connectionData: string): number | null => {
      try {
        const parsed = JSON.parse(connectionData)
        return Number(parsed?.clientData ?? parsed)
      } catch {
        const num = Number(connectionData)
        return isNaN(num) ? null : num
      }
    }

    const handleConnectionCreated = (event: { connection: { data: string } }) => {
      const connUserId = parseUserId(event.connection.data)
      if (connUserId != null && connUserId !== Number(userID)) {
        queryClient.invalidateQueries({ queryKey: ['roomMembers', roomId] })
      }
    }

    const handleConnectionDestroyed = (event: { connection: { data: string } }) => {
      const connUserId = parseUserId(event.connection.data)
      if (connUserId != null && connUserId !== Number(userID)) {
        removeMember(connUserId)
      }
    }

    session.on('connectionCreated', handleConnectionCreated)
    session.on('connectionDestroyed', handleConnectionDestroyed)

    return () => {
      session.off('connectionCreated', handleConnectionCreated)
      session.off('connectionDestroyed', handleConnectionDestroyed)
    }
  }, [session, userID, queryClient, roomId, removeMember])

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
        const isMemberScreenSharing = screenSharingUsers.has(member.userId)

        return {
          userId: member.userId,
          nickName: member.nickName,
          subscriber,
          timer: {
            time: timer ? timer.hour * 3600 + timer.min * 60 + timer.sec : 0,
            isRunning: isMemberScreenSharing || (timer?.isRunning ?? false),
          },
        }
      })
  }, [members, timers, subscribers, userID, screenSharingUsers])

  if (!isRoomEntered) {
    return (
      <div className="min-w-[1280px] overflow-hidden">
        <HeaderFallback />
      </div>
    )
  }

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
