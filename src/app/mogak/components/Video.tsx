import React, { useRef, useEffect, useCallback } from 'react'
import { StreamManager } from 'openvidu-browser'
import VideoFallback from '@/assets/svg/video-fallback.svg'

interface Props {
  streamManager?: StreamManager
  isVideoOn: boolean
}

export default function Video({ streamManager, isVideoOn }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const prevStreamManagerRef = useRef<StreamManager | undefined>(undefined)

  const clearVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = null
      videoRef.current.load()
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const prevStreamManager = prevStreamManagerRef.current

    if (streamManager) {
      if (prevStreamManager !== streamManager) {
        clearVideo()
      }
      streamManager.addVideoElement(video)
    } else if (prevStreamManager && !streamManager) {
      clearVideo()
    }

    prevStreamManagerRef.current = streamManager

    return () => {
      clearVideo()
    }
  }, [streamManager, clearVideo])

  return (
    <>
      <video
        autoPlay
        playsInline
        muted
        ref={videoRef}
        className="w-full object-cover max-h-300 aspect-[476/248] rounded-10"
      >
        <track kind="captions" />
      </video>
      {!isVideoOn && (
        <VideoFallback className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      )}
    </>
  )
}
