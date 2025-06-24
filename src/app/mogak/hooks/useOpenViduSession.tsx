import { useCallback } from 'react'
import useHandleController from './useHandleController'
import useScreenShare from './useScreenShare'
import useVideoController from './useVideoController'

export default function useOpenViduSession(sessionId: string, userId: string) {
  const {
    session,
    subscribers,
    publisher,
    connectionError,
    isConnecting,
    isConnected,
    OV,
    joinSession,
    leaveSession,
    setPublisher,
  } = useHandleController(sessionId, userId)

  const { startScreenShare, stopScreenShare, isScreenSharing } = useScreenShare(OV, session, setPublisher)

  const { isVideoEnabled, toggleVideo, startVideo, stopVideo, videoPublisher } = useVideoController(OV, session)

  // 화면 공유 시작 시 publisher 업데이트
  const handleStartScreenShare = useCallback(async () => {
    if (!isConnected) {
      console.warn('세션이 연결되지 않았습니다. 화면 공유를 시작할 수 없습니다.')
      return
    }
    await startScreenShare()
  }, [startScreenShare, isConnected])

  // 화면 공유 중지 시 publisher 정리
  const handleStopScreenShare = useCallback(() => {
    stopScreenShare()
  }, [stopScreenShare])

  return {
    session,
    subscribers,
    publisher,
    connectionError,
    isConnecting,
    isConnected,
    joinSession,
    leaveSession,
    startScreenShare: handleStartScreenShare,
    stopScreenShare: handleStopScreenShare,
    isScreenSharing,
    // 비디오 관련
    isVideoEnabled,
    toggleVideo,
    startVideo,
    stopVideo,
    videoPublisher,
  }
}
