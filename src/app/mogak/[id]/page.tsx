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

interface TimerState {
  baseTime: number
  startedAt: number
}

export default function MogakPage() {
  const roomId = useParams().id as string
  const { userID } = useUserStore()
  const { isModalOpen, confirmLeave, cancelLeave } = useLeavePrevention()
  const isRoomEntered = useRoomEntry(roomId)

  const queryClient = useQueryClient()

  const [timerStates, setTimerStates] = useState<Map<number, TimerState>>(new Map())

  const { data: TimerList } = useGetTimerList(roomId, isRoomEntered)
  const timers = TimerList?.timers ?? []

  // API에서 이미 running인 타이머 초기화
  useEffect(() => {
    timers.forEach((timer) => {
      if (timer.isRunning && !timerStates.has(timer.userId)) {
        const baseTime = timer.hour * 3600 + timer.min * 60 + timer.sec
        setTimerStates((prev) => {
          const next = new Map(prev)
          next.set(timer.userId, { baseTime, startedAt: Date.now() })
          return next
        })
      }
    })
  }, [timers])

  const handleSocketMessage = useCallback(
    async (data: Record<string, unknown>) => {
      const type = String(data?.type ?? '')
      const eventUserId = data?.userId as number | undefined

      if (type === 'timer-start' && eventUserId != null) {
        const result = await queryClient.fetchQuery({ queryKey: ['timerList', roomId] })
        const timerData = (
          result as { timers: Array<{ userId: number; hour: number; min: number; sec: number }> }
        )?.timers?.find((t) => t.userId === eventUserId)
        const baseTime = timerData ? timerData.hour * 3600 + timerData.min * 60 + timerData.sec : 0

        setTimerStates((prev) => {
          const next = new Map(prev)
          next.set(eventUserId, { baseTime, startedAt: Date.now() })
          return next
        })
      }

      if (type === 'timer-stop' && eventUserId != null) {
        setTimerStates((prev) => {
          const next = new Map(prev)
          next.delete(eventUserId)
          return next
        })
        queryClient.invalidateQueries({ queryKey: ['timerList', roomId] })
      }
    },
    [queryClient, roomId]
  )

  const {
    isConnected: isSocketConnected,
    startTimer,
    stopTimer,
  } = useSocket(roomId, isRoomEntered, {
    onMessage: handleSocketMessage,
  })

  const handleMemberJoined = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['roomMembers', roomId] })
  }, [queryClient, roomId])

  const handleMemberLeft = useCallback(
    (leftUserId: number) => {
      // 로컬 캐시에서 즉시 제거
      queryClient.setQueryData<RoomMembers>(['roomMembers', roomId, userID], (old) => {
        if (!old) return old
        return { ...old, users: old.users.filter((u) => u.userId !== leftUserId) }
      })
      // 타이머 상태 제거
      setTimerStates((prev) => {
        const next = new Map(prev)
        next.delete(leftUserId)
        return next
      })
      // API도 다시 fetch하여 확실히 동기화
      queryClient.invalidateQueries({ queryKey: ['roomMembers', roomId] })
      queryClient.invalidateQueries({ queryKey: ['timerList', roomId] })
    },
    [queryClient, roomId, userID]
  )

  const { session, subscribers, screenSharingUsers, leaveSession, ovRef, cleanupPublisher } = useOpenVidu(
    roomId,
    userID ?? undefined,
    isRoomEntered,
    { onMemberJoined: handleMemberJoined, onMemberLeft: handleMemberLeft }
  )

  const { publisher, startScreenShare, stopScreenShare, isScreenSharing, isSessionReady } = useScreenShare({
    session,
    ovRef,
    cleanupPublisher,
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
      // 컴포넌트 언마운트 시에도 cleanup (React Router 이동 등)
      stopScreenShareRef.current()
      leaveSessionRef.current()
      postLeaveRoomBeacon(Number(roomId))
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [roomId])

  const { data } = useGetRoomMembers(roomId, userID!, isRoomEntered && isSocketConnected)
  const members = data?.users ?? []

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

      const timerState = timerStates.get(member.userId)
      const apiTimer = timers.find((t) => t.userId === member.userId)
      const isMemberScreenSharing =
        screenSharingUsers.has(member.userId) && !!screenSubscriber && screenSubscriber.stream?.videoActive

      return {
        userId: member.userId,
        nickName: member.nickName,
        subscriber: screenSubscriber,
        isScreenSharing: isMemberScreenSharing,
        timer: timerState
          ? { baseTime: timerState.baseTime, startedAt: timerState.startedAt, isRunning: true }
          : {
              baseTime: apiTimer ? apiTimer.hour * 3600 + apiTimer.min * 60 + apiTimer.sec : 0,
              startedAt: null,
              isRunning: false,
            },
      }
    })
  }, [members, timers, subscribers, screenSharingUsers, timerStates])

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
          <MogakHeader
            id={roomId}
            onLeave={() => {
              stopScreenShare()
              leaveSession()
            }}
          />
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
                  timer={timer}
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
