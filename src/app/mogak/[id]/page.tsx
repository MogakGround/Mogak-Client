'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import ScreenBox from '../components/ScreenBox'
import MyStatus from '../components/MyStatus'
import MogakHeader from '../components/MogakHeader'
import { Publisher, StreamManager } from 'openvidu-browser'
import useOpenViduSession from '../hooks/useOpenViduSession'
import { useGetRoomMembers, useGetTimerList } from '../api/queries'
import { useUserStore } from '@/store/userStore'

export default function MogakPage() {
  const roomId = useParams().id as string
  const { userID } = useUserStore()

  const { publisher, subscribers, joinSession, leaveSession, startScreenShare, stopScreenShare } = useOpenViduSession(
    roomId,
    userID!
  )

  const {} = useGetTimerList(roomId)

  const { data } = useGetRoomMembers(roomId)
  const users = data?.users ?? []

  useEffect(() => {
    joinSession()
    return () => leaveSession()
  }, [])

  const extractUserId = (subscriber: StreamManager): number | null => {
    try {
      const data = subscriber.stream.connection.data
      return Number(data)
    } catch {
      return null
    }
  }

  const mappedSubscribers = subscribers.map((subscriber) => {
    const userId = extractUserId(subscriber)
    const user = users?.find((u) => u.userId === userId)

    return {
      subscriber,
      userId,
      nickName: user?.nickName ?? '알 수 없음',
    }
  })

  return (
    <div className="min-w-[1280px] overflow-hidden">
      <MogakHeader id={roomId} />
      <div className="px-80 pt-16 flex gap-15 min-h-500 h-full">
        <MyStatus
          startScreenShare={startScreenShare}
          stopScreenShare={stopScreenShare}
          publisher={publisher as Publisher}
        />
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          {mappedSubscribers.map(({ nickName, subscriber }) => (
            <ScreenBox key={subscriber.stream.streamId} nickname={nickName} time={0} subscriber={subscriber} />
          ))}
        </div>
      </div>
    </div>
  )
}
