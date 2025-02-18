import { useRef } from 'react'

export default function useScreenShare() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startScreenShare = async () => {
    try {
      const captureStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = captureStream
        streamRef.current = captureStream
      }
    } catch (err) {
      console.error('화면 공유 에러:', err)
    }
  }

  const stopScreenShare = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  return { videoRef, startScreenShare, stopScreenShare }
}
