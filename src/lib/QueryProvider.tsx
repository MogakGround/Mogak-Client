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

let lock = false

function alertOnce(msg: string) {
  if (lock) return

  lock = true
  alert(msg)
  setTimeout(() => {
    lock = false
  }, 1000)
}
