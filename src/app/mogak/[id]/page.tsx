'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import MogakHeader from '../components/MogakHeader'
import MyStatus from '../components/MyStatus'
import ScreenBox from '../components/ScreenBox'
import { Publisher } from 'openvidu-browser'
import { useQueryClient } from '@tanstack/react-query'
import { useGetRoomMembers, useGetTimerList } from '../api/queries'
import { RoomMembers } from '../api/type'
import { postLeaveRoomBeacon } from '../api/api'
import useRoomEntry from '../hooks/useRoomEntry'
import useSocket from '../hooks/useSocket'
import useOpenVidu from '../hooks/useOpenVidu'
import useScreenShare from '../hooks/useScreenShare'
import { useUserStore } from '@/store/userStore'
import { useLatestRef } from '@/hooks/useLatestRef'
import { useLeavePrevention } from '@/hooks/useLeavePrevention'
import LeavePreventionModal from '@/components/global/modal/LeavePreventionModal'
import HeaderFallback from '../components/HeaderFallback'

export default function MogakPage() {
  const roomId = useParams().id as string
  const { userID } = useUserStore()
  const { isModalOpen, confirmLeave, cancelLeave } = useLeavePrevention()
  const isRoomEntered = useRoomEntry(roomId)

  const queryClient = useQueryClient()

  const [wsScreenSharingUsers, setWsScreenSharingUsers] = useState<Set<number>>(new Set())

  const handleSocketMessage = useCallback(
    (data: Record<string, unknown>) => {
      const type = String(data?.type ?? '')
      const eventUserId = data?.userId as number | undefined

      if (type.includes('timer')) {
        queryClient.invalidateQueries({ queryKey: ['timerList', roomId] })
      }

      if (type === 'screen-share-start' && eventUserId != null) {
        setWsScreenSharingUsers((prev) => new Set(prev).add(eventUserId))
      }

      if (type === 'screen-share-stop' && eventUserId != null) {
        setWsScreenSharingUsers((prev) => {
          const next = new Set(prev)
          next.delete(eventUserId)
          return next
        })
      }
    },
    [queryClient, roomId],
  )

  const {
    isConnected: isSocketConnected,
    sendStartScreenShare,
    sendStopScreenShare,
    startTimer,
    stopTimer,
  } = useSocket(roomId, isRoomEntered, { onMessage: handleSocketMessage })

  const handleMemberJoined = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['roomMembers', roomId] })
  }, [queryClient, roomId])

  const handleMemberLeft = useCallback(
    (leftUserId: number) => {
      queryClient.setQueryData<RoomMembers>(['roomMembers', roomId, userID], (old) => {
        if (!old) return old
        return { ...old, users: old.users.filter((u) => u.userId !== leftUserId) }
      })
    },
    [queryClient, roomId, userID],
  )

  const { session, subscribers, screenSharingUsers, leaveSession, ovRef, cleanupPublisher } = useOpenVidu(
    roomId,
    userID ?? undefined,
    isRoomEntered,
    { onMemberJoined: handleMemberJoined, onMemberLeft: handleMemberLeft },
  )

  const { publisher, startScreenShare, stopScreenShare, isScreenSharing, isSessionReady } = useScreenShare({
    session,
    ovRef,
    cleanupPublisher,
    sendStartScreenShare,
    sendStopScreenShare,
  })

  const stopScreenShareRef = useLatestRef(stopScreenShare)
  const leaveSessionRef = useLatestRef(leaveSession)

  useEffect(() => {
    const handleBeforeUnload = () => {
      stopScreenShareRef.current()
      leaveSessionRef.current()
      postLeaveRoomBeacon(Number(roomId))
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      postLeaveRoomBeacon(Number(roomId))
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [roomId])

  const { data: TimerList } = useGetTimerList(roomId, isRoomEntered)
  const timers = TimerList?.timers ?? []

  const { data } = useGetRoomMembers(roomId, userID!, isRoomEntered && isSocketConnected)
  const members = data?.users ?? []

  const combinedScreenSharingUsers = useMemo(() => {
    const combined = new Set(screenSharingUsers)
    wsScreenSharingUsers.forEach((userId) => combined.add(userId))
    return combined
  }, [screenSharingUsers, wsScreenSharingUsers])

  const mappedMembers = useMemo(() => {
    if (!members.length) return []

    return members.map((member) => {
      const screenSubscriber = subscribers.find((sub) => {
        if (sub.stream?.typeOfVideo !== 'SCREEN') return false

        const raw = sub.stream.connection.data
        try {
          const parsed = JSON.parse(raw)
          return Number(parsed?.clientData ?? parsed) === member.userId
        } catch {
          return Number(raw) === member.userId
        }
      })

      const timer = timers.find((t) => t.userId === member.userId)
      const isMemberScreenSharing =
        combinedScreenSharingUsers.has(member.userId) && !!screenSubscriber && screenSubscriber.stream?.videoActive

      return {
        userId: member.userId,
        nickName: member.nickName,
        subscriber: screenSubscriber,
        isScreenSharing: isMemberScreenSharing,
        timer: {
          time: timer ? timer.hour * 3600 + timer.min * 60 + timer.sec : 0,
          isRunning: timer?.isRunning ?? false,
        },
      }
    })
  }, [members, timers, subscribers, combinedScreenSharingUsers])

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
          <Suspense fallback={null}>
            <MyStatus
              startScreenShare={startScreenShare}
              stopScreenShare={stopScreenShare}
              publisher={publisher as Publisher}
              isScreenSharing={isScreenSharing}
              isSessionReady={isSessionReady}
              startTimer={startTimer}
              stopTimer={stopTimer}
            />
          </Suspense>
          {mappedMembers.length > 0 ? (
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              {mappedMembers.map(({ userId, nickName, subscriber, isScreenSharing: memberScreenSharing, timer }) => (
                <ScreenBox
                  key={`${userId}-${memberScreenSharing ? 'sharing' : 'idle'}`}
                  nickname={nickName}
                  time={timer.time}
                  isRunning={timer.isRunning}
                  subscriber={memberScreenSharing ? subscriber : undefined}
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
