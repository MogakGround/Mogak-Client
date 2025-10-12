/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Publisher, Session as OVSession } from 'openvidu-browser'
import { useRoomStore } from '@/store/roomStore'

export default function useScreenShare(
  OV: any,
  session?: OVSession,
  setPublisher?: (pub: Publisher | undefined) => void
) {
  const publisherRef = useRef<Publisher | undefined>(undefined)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const { setScreenShareOn } = useRoomStore()

  const cleanupPublisher = useCallback(() => {
    const currentPublisher = publisherRef.current
    if (currentPublisher && session) {
      // 스트림 트랙 정리 및 세션에서 발행 해제
      const stream = currentPublisher.stream.getMediaStream()
      stream?.getTracks().forEach((track) => track.stop())
      session.unpublish(currentPublisher)
      publisherRef.current = undefined
    }

    setIsScreenSharing(false)
    setScreenShareOn(false)
    if (setPublisher) setPublisher(undefined)
  }, [session, setScreenShareOn, setPublisher])

  const startScreenShare = useCallback(() => {
    if (!OV.current || !session) {
      console.warn('OpenVidu 또는 세션이 초기화되지 않았습니다.')
      return
    }

    if (publisherRef.current) {
      cleanupPublisher()
    }

    const newPublisher = OV.current.initPublisher(undefined, {
      videoSource: 'screen',
      audioSource: false,
      resolution: '1280x720',
      frameRate: 30,
    })

    newPublisher.on('accessAllowed', () => {
      console.log('✅ 화면 공유 권한 허용됨')
      session.publish(newPublisher)
      publisherRef.current = newPublisher
      setIsScreenSharing(true)
      setScreenShareOn(true)
      if (setPublisher) setPublisher(newPublisher)
    })

    newPublisher.on('accessDenied', () => {
      console.warn('🚨 화면 공유 권한이 거부되었습니다.')
    })

    // 브라우저 UI로 화면 공유를 종료할 때
    newPublisher.on('streamDestroyed', () => {
      console.log('📴 화면 공유 스트림이 종료되었습니다.')
      cleanupPublisher()
    })

    newPublisher.on('exception', (error: unknown) => {
      console.error('화면 공유 중 오류 발생:', error)
      cleanupPublisher()
    })
  }, [OV, session, cleanupPublisher, setScreenShareOn, setPublisher])

  const stopScreenShare = useCallback(() => {
    console.log('📴 화면 공유 중지')
    cleanupPublisher()
  }, [cleanupPublisher])

  // 컴포넌트 언마운트 시 클린업
  useEffect(() => {
    return () => {
      if (publisherRef.current) {
        console.log('🧹 컴포넌트 언마운트 - 화면 공유 정리')
        cleanupPublisher()
      }
    }
  }, [cleanupPublisher])

  return {
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
    screenSharePublisher: publisherRef.current,
  }
}
