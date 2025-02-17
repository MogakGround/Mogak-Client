'use client'

import TextToggle from '@/components/global/toggle/TextToggle'
import { ToggleTheme } from '@/components/global/toggle/toggle.types'
import { useState } from 'react'
import Timer from './Timer'
import TextChip from '@/components/global/chip/TextChip'
import { ChipSize, ChipTheme, ChipVariant } from '@/components/global/chip/chip.types'
import VideoFallback from '@/assets/svg/video-fallback.svg'
import Image from 'next/image'
import useScreenShare from '../hooks/useScreenShare'

export default function MyStatus() {
  const { videoRef, startScreenShare, stopScreenShare } = useScreenShare()
  const [videoOn, setVideoOn] = useState(false)
  const [allowVideoExpand, setAllowVideoExpand] = useState(true)

  const handleShareToggle = () => {
    if (videoOn) {
      stopScreenShare()
    } else {
      startScreenShare()
    }
    setVideoOn(!videoOn)
  }

  return (
    <div className="flex flex-col bg-grayscale-900 min-w-260 max-w-320 flex-grow-0 px-[20px] py-[20px] rounded-[10px]">
      <div className="flex justify-center pb-12 gap-10 semi-20">
        <p>닉네임</p>
        <TextChip text="나" variant={ChipVariant.DEFAULT} theme={ChipTheme.ACCENT} size={ChipSize.sm} />
      </div>
      <div className="relative aspect-[476/248] bg-grayscale-800 rounded-10 mb-20">
        <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover"></video>
        {!videoOn && (
          <Image
            alt="Video Off"
            src={VideoFallback}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </div>
      <Timer />
      <div className="mt-auto space-y-12 pt-10">
        <div className="flex justify-between">
          <p className="med-14 text-grayscale-400">화면 공유</p>
          <TextToggle
            theme={ToggleTheme.LIGHT}
            isOn={videoOn}
            onToggle={handleShareToggle}
            textl="켜기"
            textr="끄기"
            className="w-70 px-0"
          />
        </div>
        <div className="flex justify-between">
          <p className="med-14 text-grayscale-400">화면 확대</p>
          <TextToggle
            theme={ToggleTheme.LIGHT}
            isOn={allowVideoExpand}
            onToggle={() => setAllowVideoExpand((prev) => !prev)}
            textl="허용"
            textr="비허용"
            className="w-70 px-0"
          />
        </div>
      </div>
    </div>
  )
}
