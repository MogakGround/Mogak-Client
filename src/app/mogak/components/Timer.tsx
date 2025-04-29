'use client'

import { ButtonSize, ButtonTheme, ButtonVariant, IconArrow } from '@/components/global/button/button.types'
import IconTextButton from '@/components/global/button/IconTextButton'
import IconPlay from '@/assets/svg/play.svg'
import IconPause from '@/assets/svg/pause.svg'
import { useState, useEffect, useRef } from 'react'
import convertTime from '@/utils/convertTime'

interface TimerProps {
  startTimer: () => void
  stopTimer: () => void
  isRunning: boolean
  initialHour: number
  initialMin: number
  initialSec: number
}

export default function Timer({
  startTimer,
  stopTimer,
  isRunning: isRunningProp,
  initialHour,
  initialMin,
  initialSec,
}: TimerProps) {
  type TimerText = '작업 시작하기' | '작업 멈추기'

  const initialTotalSeconds = initialHour * 3600 + initialMin * 60 + initialSec
  const [totalSeconds, setTotalSeconds] = useState(initialTotalSeconds)
  const [isRunning, setIsRunning] = useState(isRunningProp)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const { hours, minutes, seconds } = convertTime(totalSeconds)

  useEffect(() => {
    const initialTotal = initialHour * 3600 + initialMin * 60 + initialSec
    setTotalSeconds(initialTotal)
  }, [initialHour, initialMin, initialSec])

  const handleToggleTimer = () => {
    const next = !isRunning
    setIsRunning(next)

    if (next) {
      startTimer()
    } else {
      stopTimer()
    }
  }

  useEffect(() => {
    setIsRunning(isRunningProp)
  }, [isRunningProp])

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isRunning])

  const timerText: TimerText = isRunning ? '작업 멈추기' : '작업 시작하기'

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
        handleClick={handleToggleTimer}
        iconSrc={isRunning ? IconPause : IconPlay}
      />
    </div>
  )
}
