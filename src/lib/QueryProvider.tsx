'use client'

import { useState } from 'react'
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictPropsWithChildren } from '@/types/react'
import { ErrorResponse } from '@/app/api/api.types'

export default function QueryProvider({ children }: StrictPropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 60 * 1000,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            handleQueryError(error)
          },
        }),
      })
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

function handleQueryError(error: unknown) {
  if (error instanceof ErrorResponse) {
    if (error.status === 0) {
      alertOnce(`Network Error: ${error.message}`)
      return
    }
    if (error.status === 500) {
      alertOnce(`Server Error: ${error.message}`)
      return
    }
    if (error.status >= 400 && error.status < 500) {
      alertOnce(error.message)
      return
    }
  } else if (error instanceof Error) {
    alertOnce(error.message)
  } else {
    alertOnce('오류가 발생했습니다.')
  }
}

const shownMessages = new Map<string, number>()
const DEBOUNCE_MS = 3000

function alertOnce(msg: string) {
  const now = Date.now()
  const lastShown = shownMessages.get(msg)

  if (lastShown && now - lastShown < DEBOUNCE_MS) {
    return
  }

  shownMessages.set(msg, now)
  alert(msg)

  // 오래된 메시지 정리 (메모리 누수 방지)
  if (shownMessages.size > 20) {
    for (const [key, time] of shownMessages) {
      if (now - time > DEBOUNCE_MS) {
        shownMessages.delete(key)
      }
    }
  }
}
