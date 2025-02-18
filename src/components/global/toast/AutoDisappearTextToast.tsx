import React, { useState, useEffect } from 'react'
import { AutoDisappearTextToastProps } from '@/components/global/toast/toast.types'
import TextToast from './TextToast'

const AutoDisappearTextToast = ({
  duration = 2000,
  theme,
  size,
  text,
  detailText,
  handleClick,
}: AutoDisappearTextToastProps) => {
  const [isVisible, setIsVisible] = useState(true)

  // N초 후에 자동으로 사라지게 설정
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, duration)

    // 컴포넌트가 언마운트될 때 clearTimeout을 호출하여 타이머를 정리
    return () => clearTimeout(timer)
  }, [duration])

  // isVisible이 false이면 렌더링하지 않음
  if (!isVisible) return null

  return (
    <div>
      <TextToast theme={theme} size={size} text={text} detailText={detailText} handleClick={handleClick} />
    </div>
  )
}

export default AutoDisappearTextToast
