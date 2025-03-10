import React, { useRef, useEffect } from 'react'
import { StreamManager } from 'openvidu-browser'
import Image from 'next/image'
import VideoFallback from '@/assets/svg/video-fallback.svg'

interface Props {
  streamManager: StreamManager
  isVideoOn: boolean
}

function Video({ streamManager, isVideoOn }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const autoplay = true

  useEffect(() => {
    if (streamManager && videoRef.current) {
      streamManager.addVideoElement(videoRef.current)
    }
  }, [streamManager])

  return (
    <>
      <video autoPlay={autoplay} ref={videoRef} style={{ width: '100%' }}>
        <track kind="captions" />
      </video>
      {!isVideoOn && (
        <Image
          alt="Video Off"
          src={VideoFallback}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        />
      )}
    </>
  )
}

export default Video
