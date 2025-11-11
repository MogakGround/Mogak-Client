import axiosInstance from '../axiosInstance'
import { WorkHours } from '../room/room.types'
import { GetRoomsRequest, PostEnterRoomRequest } from './home.types'

// 모각작 방 전체 조회 (시간대별)
export const getAllRoomList = async (params: GetRoomsRequest) => {
  //return await axiosInstance.get('/room', { params })

  return await axiosInstance.get('/room', {
    params,
    paramsSerializer: (params) => {
      // 배열을 workHours=LATE_NIGHT&workHours=MORNING 형식으로 변환
      const queryParams = new URLSearchParams()

      // page와 size를 추가
      queryParams.append('page', params.page.toString())
      queryParams.append('size', params.size.toString())

      // workHours 배열을 개별 workHours 파라미터로 추가
      if (params.workHours) {
        params.workHours.forEach((workHour: WorkHours) => {
          queryParams.append('workHours', workHour)
        })
      }

      return queryParams.toString()
    },
  })
}

// 최근 만들어진 모각방 (TOP 4) 조회
export const getRecentRoomList = async () => {
  return await axiosInstance.get('/room/recent')
}

export const postEnterRoom = async (roomId: number, data: PostEnterRoomRequest) => {
  return await axiosInstance.post(`/room/${roomId}/enter`, data)
}
