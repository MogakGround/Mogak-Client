'use client'

import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconTextButton from '@/components/global/button/IconTextButton'
import IconPlay from '@/assets/svg/play.svg'
import IconPause from '@/assets/svg/pause.svg'
import { useState, useEffect } from 'react'
import convertTime from '@/utils/convertTime'

export default function Timer() {
  type TimerText = '작업 시작하기' | '작업 멈추기'

  const [totalSeconds, setTotalSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [timerText, setTimerText] = useState<TimerText>('작업 시작하기')

  const { hours, minutes, seconds } = convertTime(totalSeconds)

  useEffect(() => {
    if (!isRunning) {
      setTimerText('작업 시작하기')
      return
    }
    setTimerText('작업 멈추기')
    const interval = setInterval(() => {
      setTotalSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning])

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="bold-32 flex items-center text-center">
        <span className="w-35">{hours}</span>
        <span className="reg-20 w-40 text-grayscale-200 mr-8">시간</span>
        <span className="w-35">{minutes}</span> <span className="reg-20 w-34 text-grayscale-200 mr-8">분</span>
        <span className="w-35">{seconds}</span> <span className="reg-20 w-34 text-grayscale-200">초</span>
      </div>
      <IconTextButton
        variant={isRunning ? ButtonVariant.default : ButtonVariant.filled}
        fullWidth
        theme={ButtonTheme.primary}
        size={ButtonSize.xl}
        text={timerText}
        iconArrow={IconArrow.right}
        handleClick={() => setIsRunning(!isRunning)}
        iconSrc={isRunning ? IconPause : IconPlay}
      />
    </div>
  )
}
