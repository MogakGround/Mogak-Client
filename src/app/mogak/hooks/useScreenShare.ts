import { useState, useCallback, useRef } from 'react'
import { OpenVidu, Publisher, Session as OVSession } from 'openvidu-browser'

interface UseScreenShareProps {
  session: OVSession | undefined
  OV: React.MutableRefObject<OpenVidu>
  publisher: Publisher | undefined
  setPublisher: (publisher: Publisher | undefined) => void
  isConnected: boolean
}

export default function useScreenShare({ session, OV, publisher, setPublisher, isConnected }: UseScreenShareProps) {
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const screenPublisherRef = useRef<Publisher | undefined>(undefined)
  const stopScreenShareRef = useRef<(() => Promise<void>) | null>(null)

  const stopScreenShare = useCallback(async () => {
    if (!session || !isConnected) {
      return
    }

    try {
      const screenPublisher = screenPublisherRef.current || publisher

      if (screenPublisher) {
        // 세션에서 화면 공유 스트림 제거
        await session.unpublish(screenPublisher)

        // 스트림 트랙 정리
        const stream = screenPublisher.stream.getMediaStream()
        if (stream) {
          stream.getTracks().forEach((track) => {
            track.stop()
            console.log('🛑 화면 공유 트랙 정리됨')
          })
        }

        screenPublisherRef.current = undefined
        setPublisher(undefined)
        setIsScreenSharing(false)
        console.log('🛑 화면 공유 중지됨')
      }
    } catch (error) {
      console.error('🚨 화면 공유 중지 실패:', error)
    }
  }, [session, isConnected, publisher, setPublisher])

  // stopScreenShare를 ref에 저장
  stopScreenShareRef.current = stopScreenShare

  const startScreenShare = useCallback(async () => {
    console.log('🖥️ 화면 공유 시작 시도 - session:', !!session, 'isConnected:', isConnected)
    if (!session || !isConnected) {
      console.warn('세션이 연결되지 않았습니다.', { session: !!session, isConnected })
      return
    }

    try {
      // 브라우저의 getDisplayMedia를 사용하여 화면 스트림 가져오기
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      })

      // 화면 공유 스트림으로 Publisher 생성
      const screenPublisher = OV.current.initPublisher(undefined, {
        videoSource: screenStream.getVideoTracks()[0],
        publishAudio: false,
        publishVideo: true,
      })

      screenPublisher.on('streamPlaying', () => {
        console.log('✅ 화면 공유 스트림 재생 시작')
      })

      screenPublisher.on('streamDestroyed', () => {
        console.log('🛑 화면 공유 스트림 종료됨')
        setIsScreenSharing(false)
        screenPublisherRef.current = undefined
      })

      // 화면 공유 종료 이벤트 감지
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        if (stopScreenShareRef.current) {
          stopScreenShareRef.current()
        }
      })

      // 세션에 화면 공유 스트림 발행
      await session.publish(screenPublisher)
      screenPublisherRef.current = screenPublisher
      setPublisher(screenPublisher)
      setIsScreenSharing(true)
      console.log('🖥️ 화면 공유 시작됨')
    } catch (error) {
      console.error('🚨 화면 공유 시작 실패:', error)
      setIsScreenSharing(false)
      // 사용자가 화면 공유를 취소한 경우
      if (error instanceof Error && error.name === 'NotAllowedError') {
        alert('화면 공유 권한이 거부되었습니다.')
      } else if (error instanceof Error && error.name === 'NotReadableError') {
        alert('화면 공유를 시작할 수 없습니다. 다른 애플리케이션이 화면을 사용 중일 수 있습니다.')
      }
    }
  }, [session, isConnected, OV, setPublisher])

  return {
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
  }
}
