import { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export function useLeavePrevention() {
  const router = useRouter()
  const pathname = usePathname()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nextUrl, setNextUrl] = useState<string | null>(null)

  const showModal = useCallback((url: string) => {
    setIsModalOpen(true)
    setNextUrl(url)
  }, [])

  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')

      if (link && link.href && new URL(link.href).hostname === window.location.hostname) {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        showModal(link.href)
      }
    }

    const handlePopState = () => {
      history.pushState(null, '', pathname)
      showModal('/')
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = '작성하던 내용이 모두 사라집니다. 계속하시겠습니까?'
      return e.returnValue
    }

    document.addEventListener('click', handleLinkClick, true)
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('beforeunload', handleBeforeUnload)

    history.pushState(null, '', pathname)

    return () => {
      document.removeEventListener('click', handleLinkClick, true)
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [pathname, showModal])

  const confirmLeave = useCallback(() => {
    setIsModalOpen(false)
    if (nextUrl) {
      router.push(nextUrl)
    }
  }, [nextUrl, router])

  const cancelLeave = useCallback(() => {
    setIsModalOpen(false)
    setNextUrl(null)
  }, [])

  return { isModalOpen, confirmLeave, cancelLeave }
}
