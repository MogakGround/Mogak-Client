'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setRouter } from './navigationRef'

export default function NavigationSetter() {
  const router = useRouter()

  useEffect(() => {
    setRouter(router)
  }, [router])

  return null
}
