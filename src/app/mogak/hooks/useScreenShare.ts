'use client'

import { useCallback, useState } from 'react'
import { OpenVidu, Publisher } from 'openvidu-browser'
import { useRoomStore } from '@/store/roomStore'

interface UseScreenShareParams {
  session: ReturnType<OpenVidu['initSession']> | null
  ovRef: React.MutableRefObject<OpenVidu | null>
  cleanupPublisher: (target?: Publisher | null) => void
  sendStartScreenShare: () => void
  sendStopScreenShare: () => void
}

export default function useScreenShare({
  session,
  ovRef,
  cleanupPublisher,
  sendStartScreenShare,
  sendStopScreenShare,
}: UseScreenShareParams) {
  const [publisher, setPublisher] = useState<Publisher | null>(null)
  const [screenPublisher, setScreenPublisher] = useState<Publisher | null>(null)
  const [isStartingScreenShare, setIsStartingScreenShare] = useState(false)

  const { setScreenShareOn } = useRoomStore()

  const stopScreenShare = useCallback(() => {
    try {
      if (screenPublisher) {
        if (session) {
          session.unpublish(screenPublisher)
        }
        cleanupPublisher(screenPublisher)
      }
    } catch (err) {
      console.error('화면 공유 중지 오류:', err)
    } finally {
      setScreenPublisher(null)
      setPublisher(null)
      setScreenShareOn(false)
      sendStopScreenShare()
    }
  }, [cleanupPublisher, screenPublisher, session, setScreenShareOn, sendStopScreenShare])

  const startScreenShare = useCallback(async () => {
    if (!session || !ovRef.current) return
    if (screenPublisher || isStartingScreenShare) {
      console.log('이미 화면 공유 중이거나 시작 중입니다.')
      return
    }

    setIsStartingScreenShare(true)
    let screenPub: Publisher | null = null

    try {
      screenPub = await ovRef.current.initPublisherAsync(undefined, {
        videoSource: 'screen',
        audioSource: false,
        publishAudio: false,
        publishVideo: true,
        mirror: false,
      })

      const track = screenPub.stream?.getMediaStream()?.getVideoTracks()?.[0]
      if (track) {
        track.onended = () => stopScreenShare()
      }

      await session.publish(screenPub)
      setScreenPublisher(screenPub)
      setPublisher(screenPub)
      sendStartScreenShare()
    } catch (err) {
      console.error('화면 공유 시작 오류:', err)

      if (screenPub) {
        cleanupPublisher(screenPub)
      }

      setScreenShareOn(false)
      throw err
    } finally {
      setIsStartingScreenShare(false)
    }
  }, [cleanupPublisher, isStartingScreenShare, screenPublisher, session, ovRef, stopScreenShare, setScreenShareOn, sendStartScreenShare])

  const isScreenSharing = !!screenPublisher

  return {
    publisher,
    screenPublisher,
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
  }
}
