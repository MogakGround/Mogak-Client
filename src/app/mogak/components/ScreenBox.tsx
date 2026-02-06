'use client'

import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconTextButton from '@/components/global/button/IconTextButton'
import IconPerson from '@/assets/svg/person.svg'
import IconClock from '@/assets/svg/clock.svg'
import convertTime from '@/utils/convertTime'
import { StreamManager } from 'openvidu-browser'
import Video from './Video'
import { useEffect, useState } from 'react'

interface TimerProps {
  baseTime: number
  startedAt: number | null
  isRunning: boolean
}

interface ScreenBoxProps {
  nickname: string
  timer: TimerProps
  subscriber: StreamManager | undefined
}

export default function ScreenBox({ nickname, timer, subscriber }: ScreenBoxProps) {
  const [, setTick] = useState(0)

  // isRunning일 때만 1초마다 리렌더링
  useEffect(() => {
    if (!timer.isRunning) return
    const id = setInterval(() => setTick((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [timer.isRunning])

  // 시간 계산: baseTime + 경과시간
  const displayTime =
    timer.isRunning && timer.startedAt
      ? timer.baseTime + Math.floor((Date.now() - timer.startedAt) / 1000)
      : timer.baseTime

  const { hours, minutes, seconds } = convertTime(displayTime)
  const isVideoOn = Boolean(subscriber) && Boolean(subscriber?.stream?.videoActive)

  return (
    <div className="relative bg-grayscale-800 rounded-10 min-w-300 max-h-300">
      <div className="absolute top-16 left-16 flex gap-12 z-10">
        <IconTextButton
          variant={ButtonVariant.default}
          theme={ButtonTheme.white}
          size={ButtonSize.sm}
          text={nickname}
          handleClick={() => {}}
          iconArrow={IconArrow.left}
          iconSrc={IconPerson}
          iconWidth={16}
          className="h-36 pointer-events-none bg-grayscale-700"
        />
        <IconTextButton
          variant={ButtonVariant.default}
          theme={ButtonTheme.white}
          size={ButtonSize.xs}
          handleClick={() => {}}
          iconArrow={IconArrow.left}
          iconSrc={IconClock}
          className="h-36 pointer-events-none bg-grayscale-700"
        >
          <div className="med-14 flex items-center text-center h-36 whitespace-nowrap">
            <span className="w-17">{hours}</span>
            <span className="reg-14 w-24 text-grayscale-300 mr-12">시간</span>
            <span className="w-17">{minutes}</span> <span className="reg-14 w-13 text-grayscale-200 mr-12">분</span>
            <span className="w-17">{seconds}</span> <span className="reg-14 w-13 text-grayscale-200">초</span>
          </div>
        </IconTextButton>
      </div>
      <Video isVideoOn={isVideoOn} streamManager={subscriber} />
    </div>
  )
}
