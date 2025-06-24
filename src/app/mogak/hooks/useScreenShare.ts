/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useRef, useState } from 'react'
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

  const startScreenShare = useCallback(async () => {
    if (!OV.current || !session) {
      console.warn('OpenVidu 또는 세션이 초기화되지 않았습니다.')
      return
    }

    try {
      // 기존 화면 공유가 실행 중이면 중지
      if (publisherRef.current) {
        stopScreenShare()
      }

      const newPublisher = OV.current.initPublisher(undefined, {
        videoSource: 'screen',
        publishAudio: false,
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

      // 스트림 종료 이벤트 처리 (사용자가 화면 공유 중지)
      newPublisher.on('streamDestroyed', () => {
        console.log('📴 화면 공유 스트림이 종료되었습니다.')
        stopScreenShare()
      })

      // 에러 처리
      newPublisher.on('exception', (error: unknown) => {
        console.error('화면 공유 중 오류 발생:', error)
        stopScreenShare()
      })
    } catch (error) {
      console.error('화면 공유 시작 중 오류:', error)
    }
  }, [OV, session, setScreenShareOn, setPublisher])

  const stopScreenShare = useCallback(() => {
    if (publisherRef.current && session) {
      console.log('📴 화면 공유 중지')

      session.unpublish(publisherRef.current)
      publisherRef.current = undefined
      setIsScreenSharing(false)
      setScreenShareOn(false)
      if (setPublisher) setPublisher(undefined)
    }
  }, [session, setScreenShareOn, setPublisher])

  return {
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
    screenSharePublisher: publisherRef.current,
  }
}
