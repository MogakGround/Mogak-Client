import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import HomeContent from './components/HomeContent'

const ITEMS_PER_PAGE = 12

export default async function Home() {
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['recentRooms'],
      queryFn: async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room/recent`)
        if (!res.ok) return []
        const json = await res.json()
        return json.data
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['allRooms', 1, undefined],
      queryFn: async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/room?page=1&size=${ITEMS_PER_PAGE}`)
        if (!res.ok) return { rooms: [], totalPages: 1, currentPage: 1, totalRooms: 0 }
        const json = await res.json()
        return json.data
      },
    }),
  ])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeContent />
    </HydrationBoundary>
  )
}
