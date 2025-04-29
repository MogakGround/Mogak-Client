import { dehydrate, FetchQueryOptions, HydrationBoundary, QueryClient } from '@tanstack/react-query'

type PrefetchBoundaryType = {
  children: React.ReactElement
  options: FetchQueryOptions
}

export default async function PrefetchBoundary({ children, options }: PrefetchBoundaryType) {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(options)
  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>
}
