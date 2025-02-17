import { RoomNewStatus } from '@/components/room/new/hooks/useCreateRoom'

export const stepMessages: Record<RoomNewStatus, string> = {
  step1: '직접 모각방장이 되어 빠르게 모각작을 시작해보세요!',
  step2: '모각방에 어울리는 사진을 한가지 골라주세요',
  step3: '마지막 단계에요! 모각방에 대한 세부 설정을 해주세요',
}

export const THUMBNAIL_LIST = [
  {
    id: 'thumbnail1',
    image: '/images/thumbnail/thumbnail1.jpg',
  },
  {
    id: 'thumbnail2',
    image: '/images/thumbnail/thumbnail2.jpg',
  },
  {
    id: 'thumbnail3',
    image: '/images/thumbnail/thumbnail3.jpg',
  },
  {
    id: 'thumbnail4',
    image: '/images/thumbnail/thumbnail4.jpg',
  },
]

export const WORK_TIME_TAG_LIST = [
  {
    id: 'work-time-tag1',
    name: '야간',
    description: '오후 10시 ~ 오전 5시',
  },
  {
    id: 'work-time-tag2',
    name: '저녁 시간대',
    description: '오후 6시 ~ 오후 10시',
  },
  {
    id: 'work-time-tag3',
    name: '오후 시간대',
    description: '정오 ~ 오후 6시',
  },
  {
    id: 'work-time-tag4',
    name: '오전 시간대',
    description: '아침 6시 ~ 정오',
  },
]
