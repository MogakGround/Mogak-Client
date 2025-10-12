'use client'

import { useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import ScreenBox from '../components/ScreenBox'
import MyStatus from '../components/MyStatus'
import MogakHeader from '../components/MogakHeader'
import { Publisher } from 'openvidu-browser'
import useOpenViduSession from '../hooks/useOpenViduSession'
import { useGetRoomMembers, useGetTimerList } from '../api/queries'
import { useUserStore } from '@/store/userStore'
import { useRoomStore } from '@/store/roomStore'
import { useLeavePrevention } from '@/hooks/useLeavePrevention'
import LeavePreventionModal from '@/components/global/modal/LeavePreventionModal'

export default function MogakPage() {
  const roomId = useParams().id as string
  const { userID } = useUserStore()

  const { isModalOpen, confirmLeave, cancelLeave } = useLeavePrevention()

  const { publisher, subscribers, joinSession, leaveSession, startScreenShare, stopScreenShare, isScreenSharing } =
    useOpenViduSession(roomId, String(userID) ?? '')

  const { data: TimerList } = useGetTimerList(roomId)
  const timers = TimerList?.timers ?? []

  const { data } = useGetRoomMembers(roomId)
  const { members, setMembers } = useRoomStore()

  useEffect(() => {
    joinSession()
    return () => leaveSession()
  }, [roomId, userID])

  useEffect(() => {
    if (data?.users) {
      setMembers(data.users)
    }
  }, [data, setMembers])

  const mappedMembers = useMemo(() => {
    if (!timers.length || !members.length) return []

    console.log(userID)

    return members
      .filter((member) => member.userId !== Number(userID))
      .map((member) => {
        const subscriber = subscribers.find((sub) => {
          const data = sub.stream.connection.data
          return Number(data) === member.userId
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
                key={subscriber?.stream.streamId || userId}
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
