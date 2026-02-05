import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

let routerRef: AppRouterInstance | null = null

export function setRouter(router: AppRouterInstance) {
  routerRef = router
}

export function navigate(path: string) {
  if (routerRef) {
    routerRef.replace(path)
  } else {
    window.location.href = path
  }
}
