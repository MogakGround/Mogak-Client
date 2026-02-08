'use client'

import { useCallback, useRef, useState } from 'react'
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

  // Ref to hold the latest screenPublisher for use in event handlers (avoids stale closure)
  const screenPublisherRef = useRef<Publisher | null>(null)

  const { setScreenShareOn } = useRoomStore()

  const stopScreenShare = useCallback(() => {
    // Use ref to get the current screenPublisher value (avoids stale closure in onended handler)
    const currentPublisher = screenPublisherRef.current
    try {
      if (currentPublisher) {
        if (session) {
          session.unpublish(currentPublisher)
        }
        cleanupPublisher(currentPublisher)
      }
    } catch (err) {
      console.error('화면 공유 중지 오류:', err)
    } finally {
      screenPublisherRef.current = null
      setScreenPublisher(null)
      setPublisher(null)
      setScreenShareOn(false)
      sendStopScreenShare()
    }
  }, [cleanupPublisher, session, setScreenShareOn, sendStopScreenShare])

  const startScreenShare = useCallback(async () => {
    if (!session || !ovRef.current) throw new Error('세션이 아직 연결되지 않았습니다.')
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

      await session.publish(screenPub)

      // Update ref and state AFTER successful publish
      screenPublisherRef.current = screenPub
      setScreenPublisher(screenPub)
      setPublisher(screenPub)

      // Register onended handler AFTER publish so stopScreenShare can access the publisher via ref
      const track = screenPub.stream?.getMediaStream()?.getVideoTracks()?.[0]
      if (track) {
        track.onended = () => stopScreenShare()
      }

      sendStartScreenShare()
    } catch (err) {
      console.error('화면 공유 시작 오류:', err)

      if (screenPub) {
        cleanupPublisher(screenPub)
      }

      screenPublisherRef.current = null
      setScreenShareOn(false)
      throw err
    } finally {
      setIsStartingScreenShare(false)
    }
  }, [cleanupPublisher, isStartingScreenShare, screenPublisher, session, ovRef, stopScreenShare, setScreenShareOn, sendStartScreenShare])

  const isScreenSharing = !!screenPublisher

  const isSessionReady = !!session

  return {
    publisher,
    screenPublisher,
    startScreenShare,
    stopScreenShare,
    isScreenSharing,
    isSessionReady,
  }
}
