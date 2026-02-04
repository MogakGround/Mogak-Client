'use client'

import TextToggle from '@/components/global/toggle/TextToggle'
import { ToggleTheme } from '@/components/global/toggle/toggle.types'
import { useEffect } from 'react'
import Timer from './Timer'
import TextChip from '@/components/global/chip/TextChip'
import { ChipSize, ChipTheme, ChipVariant } from '@/components/global/chip/chip.types'
import Video from './Video'
import { Publisher } from 'openvidu-browser'
import { useRoomStore } from '@/store/roomStore'
import { useGetMyStatus } from '../api/queries'
import { useParams } from 'next/navigation'

interface MyStatusProps {
  publisher?: Publisher
  startScreenShare: () => Promise<void> | void
  stopScreenShare: () => void
  isScreenSharing?: boolean
  sendStartScreenShare: () => void
  sendStopScreenShare: () => void
  startTimer: () => void
  stopTimer: () => void
}
export default function MyStatus({
  publisher,
  startScreenShare,
  stopScreenShare,
  isScreenSharing: propIsScreenSharing,
  sendStartScreenShare,
  sendStopScreenShare,
  startTimer,
  stopTimer,
}: MyStatusProps) {
  const roomId = useParams().id as string
  const { screenShareOn, setScreenShareOn } = useRoomStore()

  const { data } = useGetMyStatus(roomId)

  const { nickName = '', isScreenSharing = false, isTimerRunning = false, hour = 0, min = 0, sec = 0 } = data ?? {}

  useEffect(() => {
    setScreenShareOn(isScreenSharing)
  }, [isScreenSharing])

  useEffect(() => {
    if (screenShareOn) {
      const start = async () => {
        try {
          await startScreenShare()
          sendStartScreenShare()
        } catch {
          setScreenShareOn(false)
        }
      }
      start()
      return
    }
    stopScreenShare()
    sendStopScreenShare()
  }, [screenShareOn, startScreenShare, stopScreenShare, sendStartScreenShare, sendStopScreenShare, setScreenShareOn])

  const handleToggleScreenOn = () => {
    setScreenShareOn(!screenShareOn)
  }

  return (
    <div className="flex flex-col bg-grayscale-900 min-w-260 max-w-320 px-[20px] py-[20px] rounded-[10px]">
      <div className="flex justify-center pb-12 gap-10 semi-20">
        <p>{nickName}</p>
        <TextChip text="나" variant={ChipVariant.DEFAULT} theme={ChipTheme.ACCENT} size={ChipSize.sm} />
      </div>
      <div className="relative aspect-[476/248] bg-grayscale-800 rounded-10 mb-20">
        <Video isVideoOn={screenShareOn} streamManager={publisher} />
      </div>
      <Timer
        startTimer={startTimer}
        stopTimer={stopTimer}
        initialHour={hour}
        initialMin={min}
        initialSec={sec}
        isRunning={isTimerRunning}
      />

      <div className="flex justify-between mt-[40px]">
        <p className="med-14 text-grayscale-400">화면 공유</p>
        <TextToggle
          theme={ToggleTheme.LIGHT}
          isOn={screenShareOn}
          onToggle={handleToggleScreenOn}
          textl="켜기"
          textr="끄기"
          className="w-70 px-0"
        />
      </div>
    </div>
  )
}
