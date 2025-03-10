'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import ScreenBox from '../components/ScreenBox'
import MyStatus from '../components/MyStatus'
import MogakHeader from '../components/MogakHeader'
import useOpenViduSession from '../hooks/useOpenViduSession'
import { Publisher } from 'openvidu-browser'

export default function MogakPage() {
  const sessionId = useParams()?.id as string

  const { subscribers, publisher, joinSession, leaveSession } = useOpenViduSession(sessionId)

  useEffect(() => {
    joinSession()
    return () => leaveSession()
  }, [])

  return (
    <div className="min-w-[1280px] overflow-hidden">
      <MogakHeader />
      <div className="px-80 pt-16 flex gap-15 min-h-500 h-full">
        <MyStatus publisher={publisher as Publisher} />
        <div className="grid grid-cols-2 gap-4 flex-grow">
          {subscribers.map((subscriberItem) => (
            <ScreenBox key={subscriberItem.stream.streamId} nickname="aeong" time={0} subscriber={subscriberItem} />
          ))}
        </div>
      </div>
    </div>
  )
}
