import { useState, useCallback, useRef, useEffect } from 'react'
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
  const screenPublisherRef = useRef<Publisher>()

  const finalizeStop = useCallback(
    (screenPublisher?: Publisher) => {
      if (!screenPublisher || screenPublisherRef.current !== screenPublisher) {
        return
      }

      const mediaStream = screenPublisher.stream?.getMediaStream()
      mediaStream?.getTracks().forEach((track) => track.stop())

      screenPublisherRef.current = undefined
      if (publisher === screenPublisher) {
        setPublisher(undefined)
      }
      setIsScreenSharing(false)
    },
    [publisher, setPublisher]
  )

  const stopScreenShare = useCallback(async () => {
    const screenPublisher = screenPublisherRef.current

    if (!screenPublisher) {
      return
    }

    try {
      if (session && isConnected) {
        await session.unpublish(screenPublisher)
      }
    } catch (error) {
      console.warn('화면 공유 해제 중 세션 언퍼블리시 실패', error)
    } finally {
      finalizeStop(screenPublisher)
      console.log('🛑 화면 공유 중지됨')
    }
  }, [finalizeStop, isConnected, session])

  const startScreenShare = useCallback(async () => {
    console.log('🖥️ 화면 공유 시작 시도 - session:', !!session, 'isConnected:', isConnected)

    if (!session || !isConnected) {
      console.warn('세션이 연결되지 않았습니다.', { session: !!session, isConnected })
      return
    }

    if (screenPublisherRef.current) {
      console.log('이미 화면 공유 중입니다.')
      return
    }

    try {
      const screenPublisher = await OV.current.initPublisherAsync(undefined, {
        videoSource: 'screen',
        publishAudio: false,
        publishVideo: true,
        mirror: false,
      })

      screenPublisher.once('streamPlaying', () => {
        console.log('✅ 화면 공유 스트림 재생 시작')
      })

      screenPublisher.once('streamDestroyed', () => {
        console.log('🛑 화면 공유 스트림 종료됨')
        finalizeStop(screenPublisher)
      })

      const videoTrack = screenPublisher.stream?.getMediaStream()?.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.addEventListener('ended', () => {
          stopScreenShare()
        })
      }

      screenPublisherRef.current = screenPublisher

      await session.publish(screenPublisher)
      setPublisher(screenPublisher)
      setIsScreenSharing(true)
      console.log('🖥️ 화면 공유 시작됨')
    } catch (error: unknown) {
      console.error('🚨 화면 공유 시작 실패:', error)
      finalizeStop(screenPublisherRef.current)

      const errorName = (error as { name?: string })?.name
      if (errorName === 'SCREEN_CAPTURE_DENIED' || errorName === 'NotAllowedError') {
        alert('화면 공유가 취소되었거나 권한이 거부되었습니다.')
      } else if (errorName === 'SCREEN_EXTENSION_NOT_INSTALLED' || errorName === 'SCREEN_EXTENSION_DISABLED') {
        alert('화면 공유 확장 프로그램을 활성화하거나 설치해야 합니다.')
      } else if (errorName === 'SCREEN_SHARING_NOT_SUPPORTED') {
        alert('이 브라우저에서는 화면 공유를 지원하지 않습니다.')
      }
    }
  }, [OV, finalizeStop, isConnected, session, setPublisher, stopScreenShare])

  useEffect(() => {
    if (!isConnected && screenPublisherRef.current) {
      finalizeStop(screenPublisherRef.current)
    }
  }, [finalizeStop, isConnected])

  useEffect(
    () => () => {
      if (screenPublisherRef.current) {
        finalizeStop(screenPublisherRef.current)
      }
    },
    [finalizeStop]
  )

  return {
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
  }
}
