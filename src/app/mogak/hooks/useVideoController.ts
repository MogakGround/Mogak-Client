import { useCallback, useRef, useState } from 'react'
import { OpenVidu, Publisher, Session as OVSession } from 'openvidu-browser'

export default function useVideoController(OV: React.MutableRefObject<OpenVidu>, session?: OVSession) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const videoPublisherRef = useRef<Publisher | undefined>(undefined)

  const toggleVideo = useCallback(() => {
    if (videoPublisherRef.current) {
      videoPublisherRef.current.publishVideo(!isVideoEnabled)
      setIsVideoEnabled(!isVideoEnabled)
    }
  }, [isVideoEnabled])

  const startVideo = useCallback(async () => {
    if (!OV.current || !session) {
      console.warn('OpenVidu 또는 세션이 초기화되지 않았습니다.')
      return
    }

    try {
      const videoPublisher = OV.current.initPublisher(undefined, {
        audioSource: false,
        videoSource: undefined,
        publishAudio: false,
        publishVideo: true,
      })

      videoPublisher.on('accessAllowed', () => {
        console.log('✅ 비디오 권한 허용됨')
        session.publish(videoPublisher)
        videoPublisherRef.current = videoPublisher
      })

      videoPublisher.on('accessDenied', () => {
        console.warn('🚨 비디오 권한이 거부되었습니다.')
      })

      videoPublisher.on('streamPlaying', () => {
        console.log('비디오 스트림 재생 시작')
      })
    } catch (error) {
      console.error('비디오 시작 중 오류:', error)
    }
  }, [OV, session])

  const stopVideo = useCallback(() => {
    if (videoPublisherRef.current && session) {
      console.log('📹 비디오 중지')
      session.unpublish(videoPublisherRef.current)
      videoPublisherRef.current = undefined
    }
  }, [session])

  return {
    isVideoEnabled,
    toggleVideo,
    startVideo,
    stopVideo,
    videoPublisher: videoPublisherRef.current,
  }
}
