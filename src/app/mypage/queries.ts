import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { getMyRooms, getSevenDaysRooms, patchMyProfile } from '@/app/api/mypage/api'
import { getMyProfile } from '@/app/api/user/api'
import { PatchProfileRequest } from '@/app/api/mypage/mypage.types'

const ITEMS_PER_PAGE = 12

export const useGetMyProfile = () => {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: getMyProfile,
  })
}

export const useGetMyRooms = (page: number) => {
  return useQuery({
    queryKey: ['myRooms', page],
    queryFn: () => getMyRooms({ page, size: ITEMS_PER_PAGE }),
    placeholderData: keepPreviousData,
    select: (data) => ({
      rooms: data.rooms,
      totalPage: Math.ceil(data.totalPage !== 0 ? data.totalPage / ITEMS_PER_PAGE : 1),
    }),
  })
}

export const useGetSevenDaysRooms = (page: number) => {
  return useQuery({
    queryKey: ['sevenDaysRooms', page],
    queryFn: () => getSevenDaysRooms({ page, size: ITEMS_PER_PAGE }),
    placeholderData: keepPreviousData,
    select: (data) => ({
      rooms: data.rooms,
      totalPage: Math.ceil(data.totalPage !== 0 ? data.totalPage / ITEMS_PER_PAGE : 1),
    }),
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: PatchProfileRequest) => patchMyProfile(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProfile'] })
    },
  })
}
