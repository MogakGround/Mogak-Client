'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import ScreenBox from '../components/ScreenBox'
import MyStatus from '../components/MyStatus'
import MogakHeader from '../components/MogakHeader'
import { Publisher } from 'openvidu-browser'
import useOpenViduSession from '../hooks/useOpenViduSession'

export default function MogakPage() {
  const sessionId = useParams()?.id as string

  const { publisher, subscribers, joinSession, leaveSession, startScreenShare, stopScreenShare } = useOpenViduSession(
    sessionId,
    'aeong'
  )

  useEffect(() => {
    joinSession()
    return () => leaveSession()
  }, [])

  return (
    <div className="min-w-[1280px] overflow-hidden">
      <MogakHeader />
      <div className="px-80 pt-16 flex gap-15 min-h-500 h-full">
        <MyStatus
          startScreenShare={startScreenShare}
          stopScreenShare={stopScreenShare}
          publisher={publisher as Publisher}
        />
        <div className="grid grid-cols-2 gap-4 flex-grow">
          {subscribers.map((subscriberItem) => (
            <ScreenBox key={subscriberItem.stream.streamId} nickname="aeong" time={0} subscriber={subscriberItem} />
          ))}
        </div>
      </div>
    </div>
  )
}
