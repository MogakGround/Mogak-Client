import React, { useRef, useEffect } from 'react'
import { StreamManager } from 'openvidu-browser'
import VideoFallback from '@/assets/svg/video-fallback.svg'

interface Props {
  streamManager?: StreamManager
  isVideoOn: boolean
}

export default function Video({ streamManager, isVideoOn }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const autoplay = true

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current)
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [streamManager])

  return (
    <>
      <video autoPlay={autoplay} ref={videoRef} className="w-full object-cover max-h-300 aspect-[476/248] rounded-10">
        <track kind="captions" />
      </video>
      {(!isVideoOn || !streamManager) && (
        <VideoFallback
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </>
  )
}
